import fs from "fs"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { GenerateEPUBOptions, EpubContent, GenerateEPUBConfig } from "@/Protocols/EbookGeneratorProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import { ParsedRSS } from "@/Protocols/ParserProtocol"

import TempFolderService from "@/Services/TempFolderService"
import ParserService from "@/Services/ParserService"
import EbookGeneratorService from "@/Services/EbookGeneratorService"
import EbookCoverService from "@/Services/EbookCoverService"
import RSSContentEnricherService from "@/Services/RSSContentEnricherService"
import QueueService from "@/Services/QueueService"

import FileUtil from "@/Utils/FileUtil"
import DateUtil from "@/Utils/DateUtil"
import DataManipulationUtil from "@/Utils/DataManipulationUtil"
import SanitizationUtil from "@/Utils/SanitizationUtil"

class RSSConverterTool implements ConverterContract<Buffer> {
	private readonly queueService = new QueueService({ concurrency: 10 })
	private readonly parserService = new ParserService()
	private readonly ebookGeneratorService = new EbookGeneratorService()
	private readonly ebookCoverService = new EbookCoverService()

	async convert (content: Content<Buffer>): Promise<DocumentModel[]> {
		const EPUBConfig = await this.RSSToEPUBConfig(content.data, content.sourceConfig)

		const documents: DocumentModel[] = await Promise.all(
			EPUBConfig.options.map(async EPUBOption => (
				await this.queueService.enqueue(async () => {
					const coverPath = await this.ebookCoverService.generate({
						rawCoverUrl: EPUBOption.cover,
						title: EPUBOption.metadata.title,
						subTitle: EPUBOption.metadata.subTitle
					})

					const epubFilePath = await this.EPUBOptionToEPUB(EPUBOption)

					const kindleFilePath = await this.convertToKindleFile(epubFilePath, content.sourceConfig, coverPath, EPUBOption.title)
					const kindleFileData = fs.createReadStream(kindleFilePath)

					const { filename } = FileUtil.parseFilePath(kindleFilePath)

					return new DocumentModel({
						title: EPUBOption.title,
						filename,
						data: kindleFileData,
						type: content.sourceConfig.type
					})
				})
			))
		)

		return documents
	}

	private async RSSToEPUBConfig (rssBuffer: Buffer, sourceConfig: SourceConfig): Promise<GenerateEPUBConfig> {
		const rssString = rssBuffer.toString()

		const parsedRSS = await this.parserService.parseRSS(rssString)

		parsedRSS.items = this.applySourceConfigDataManipulation(parsedRSS.items, sourceConfig)

		const content: EpubContent[] = await Promise.all(
			parsedRSS.items?.map(async item => {
				const content: EpubContent = {
					title: item.title,
					author: item.creator,
					data: item.content
				}

				content.data = await RSSContentEnricherService.enrich(sourceConfig, item)

				return content
			})
		)

		let options: GenerateEPUBOptions[] = []

		const metadataTitle = parsedRSS.title

		if (this.isSinglePostPerDocumentConfig(sourceConfig)) {
			options = content.map(item => {
				const metadataSubTitle = item.title

				return {
					title: `${metadataTitle} - ${metadataSubTitle}`,
					author: item.author,
					publisher: parsedRSS.creator,
					cover: parsedRSS.imageUrl,
					content: [item],
					metadata: {
						title: metadataTitle,
						subTitle: metadataSubTitle
					}
				}
			})
		} else {
			const metadataSubTitle = DateUtil.todayFormattedDate

			options = [{
				title: `${metadataTitle} ${metadataSubTitle}`,
				author: parsedRSS.author,
				publisher: parsedRSS.creator,
				cover: parsedRSS.imageUrl,
				content,
				metadata: {
					title: metadataTitle,
					subTitle: metadataSubTitle
				}
			}]
		}

		return {
			options
		}
	}

	private async EPUBOptionToEPUB (EPUBConfig: GenerateEPUBOptions): Promise<string> {
		const epubFileName = SanitizationUtil.sanitizeFilename(`${EPUBConfig.title}.epub`)
		const epubFilePath = await TempFolderService.mountTempPath(epubFileName)

		await this.ebookGeneratorService.generateEPUB(epubFilePath, EPUBConfig)

		return epubFilePath
	}

	private async convertToKindleFile (epubFilePath: string, sourceConfig: SourceConfig, customCoverPath: string, title: string): Promise<string> {
		return await this.ebookGeneratorService.convertEPUBToKindleFile(epubFilePath, {
			noInlineToc: this.isSinglePostPerDocumentConfig(sourceConfig),
			cover: customCoverPath,
			title
		})
	}

	private isSinglePostPerDocumentConfig (sourceConfig: SourceConfig): boolean {
		return Boolean(sourceConfig?.splitRSSPosts)
	}

	private applySourceConfigDataManipulation (data: ParsedRSS["items"], sourceConfig: SourceConfig): ParsedRSS["items"] {
		return DataManipulationUtil.manipulateArray(data, {
			order: {
				property: "publishDate",
				type: sourceConfig?.order ?? "desc"
			},
			limit: sourceConfig.count
		})
	}
}

export default new RSSConverterTool()
