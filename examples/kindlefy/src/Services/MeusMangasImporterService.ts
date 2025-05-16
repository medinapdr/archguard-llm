import fs from "fs"
import FormData from "form-data"

import {
	MangaSearchResult,
	MangaChapterSearchResult,
	Manga,
	MangaImporterContract
} from "@/Protocols/MangaImporterProtocol"
import { MeusMangasChapterImageListResult, MeusMangasSearchResult, RawChapter, RawChapterPicture } from "@/Protocols/MeusMangasProtocol"

import HttpService from "@/Services/HttpService"
import CrawlerService from "@/Services/CrawlerService"
import CompressionService from "@/Services/CompressionService"
import TempFolderService from "@/Services/TempFolderService"

import FileUtil from "@/Utils/FileUtil"
import SanitizationUtil from "@/Utils/SanitizationUtil"

class MeusMangasImporterService implements MangaImporterContract {
	private readonly httpService: HttpService
	private readonly websiteBaseURL = "https://seemangas.com"
	private readonly requestAuthTokens = {
		MANGA_SEARCH_NONCE: "e154db27c2",
		MANGA_CHAPTERS_SECURITY: "x2a6sx28sa"
	}
	private readonly websiteHeaders = {
		Referer: this.websiteBaseURL
	}

	constructor () {
		this.httpService = new HttpService({
			baseURL: this.websiteBaseURL,
			headers: this.websiteHeaders
		})
	}

	async getManga (name: string): Promise<Manga> {
		const manga = await this.searchManga(name)

		const mangaChapters = await this.searchMangaChapters(manga)

		return {
			title: manga.title,
			chapters: mangaChapters,
			coverUrl: manga.coverUrl
		}
	}

	private async searchManga (name: string): Promise<MangaSearchResult> {
		const json = await this.httpService.toJSON<Record<string, MeusMangasSearchResult>>(`wp-json/site/search/?keyword=${name}&nonce=${this.requestAuthTokens.MANGA_SEARCH_NONCE}`)

		const [manga] = Object.values(json)

		const mangaPath = manga.url.replace(this.websiteBaseURL, "")

		return {
			title: manga.title,
			path: mangaPath,
			coverUrl: manga.img
		}
	}

	private async searchMangaChapters (manga: MangaSearchResult): Promise<MangaChapterSearchResult[]> {
		const rawChapters = await this.getRawChaptersByMangaPath(manga.path)

		const chapters: MangaChapterSearchResult[] = rawChapters.map(rawChapter => {
			const title = `Chapter ${rawChapter.no}`
			const no = rawChapter.no
			const createdAt = rawChapter.date

			return {
				createdAt,
				no,
				title,
				getZipFile: async () => {
					const rawChapterPictures = await this.getRawChapterPictures(rawChapter.path)

					const compressionService = new CompressionService()

					const zipFileName = SanitizationUtil.sanitizeFilename(`${manga.title}-${no}.zip`)
					const zipFilePath = await TempFolderService.mountTempPath(zipFileName)

					const zipFileStream = fs.createWriteStream(zipFilePath)

					compressionService.pipe(zipFileStream)

					const httpService = new HttpService({
						headers: this.websiteHeaders
					})

					await Promise.all(
						rawChapterPictures.map(async rawChapterPicture => {
							const rawChapterPictureReadStream = await httpService.toReadStream(rawChapterPicture.url)

							const { filename } = FileUtil.parseFilePath(rawChapterPicture.url)

							compressionService.addFile({ data: rawChapterPictureReadStream, fileName: filename })
						})
					)

					await compressionService.compress()

					const zipFile = await fs.promises.readFile(zipFilePath)

					return {
						data: zipFile,
						path: zipFilePath
					}
				}
			}
		})

		return chapters
	}

	private async getRawChaptersByMangaPath (mangaPath: string): Promise<RawChapter[]> {
		const html = await this.httpService.toString(mangaPath)

		const rawChapters: RawChapter[] = []

		const chapterListElements = CrawlerService.findElements({
			html,
			selector: "#chapter-list > div.list-load > ul > li > a"
		})

		chapterListElements.forEach(chapterListElement => {
			const chapterTitleElement = CrawlerService.getElementByClassName(chapterListElement, "cap-text")
			const chapterDateElement = CrawlerService.getElementByClassName(chapterListElement, "chapter-date")

			const chapterNumber = parseInt(chapterTitleElement.lastChild.data)
			const chapterDate = chapterDateElement.lastChild.data

			const chapterUrl = chapterListElement.attribs.href
			const chapterPath = chapterUrl.replace(this.websiteBaseURL, "")

			if (chapterNumber) {
				rawChapters.push({
					no: chapterNumber,
					date: chapterDate,
					path: chapterPath
				})
			}
		})

		return rawChapters
	}

	private async getRawChapterPictures (chapterPath: string): Promise<RawChapterPicture[]> {
		const postRawId = chapterPath.split("-")?.pop()
		const postId = postRawId?.replace(/\D/g, "")

		const formData = new FormData()

		formData.append("action", "get_image_list")
		formData.append("id_serie", postId)
		formData.append("security", this.requestAuthTokens.MANGA_CHAPTERS_SECURITY)

		const chapterImageList = await this.httpService.makeRawRequest<MeusMangasChapterImageListResult>("POST", "/wp-admin/admin-ajax.php", formData, {
			headers: {
				"Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`
			}
		})

		const rawChapterPictures: RawChapterPicture[] = chapterImageList.images.map((image, index) => ({
			url: image.url,
			order: index + 1
		}))

		return rawChapterPictures
	}
}

export default new MeusMangasImporterService()
