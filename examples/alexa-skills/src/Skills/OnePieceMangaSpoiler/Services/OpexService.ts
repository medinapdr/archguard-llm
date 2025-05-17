import CrawlerService from "@/Services/CrawlerService"

import DateUtil from "@/Skills/OnePieceMangaSpoiler/Utils/DateUtil"
import SanitizationUtil from "@/Skills/OnePieceMangaSpoiler/Utils/SanitizationUtil"

import SpoilerContentPhrasesConstant from "@/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant"

import { SpoilerInfo } from "@/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol"

class OpexService {
	getSpoilerPageUrlByLandingPageHTML (html: string): string | null {
		const [postElement] = CrawlerService.findElements({
			html,
			selector: "article.category-manga.category-spoiler"
		})

		if (!postElement) {
			return null
		}

		const linkElement = CrawlerService.findChildElement({
			currentElement: postElement,
			selector: {
				type: "tag",
				value: "a"
			}
		})

		const spoilerPageUrl = linkElement?.attribs?.href

		if (!spoilerPageUrl) {
			return null
		}

		return spoilerPageUrl
	}

	getSpoilerInfoBySpoilerPageHTML (html: string): SpoilerInfo {
		return {
			status: this.getSpoilerInfoStatusBySpoilerPageHTML(html),
			content: this.getSpoilerInfoContentBySpoilerPageHTML(html),
			date: this.getSpoilerInfoDateBySpoilerPageHTML(html)
		}
	}

	private getSpoilerInfoDateBySpoilerPageHTML (html: string): Date | null {
		const [dateElement] = CrawlerService.findElements({
			html,
			selector: "#post > header > div.info > span.autor > time"
		})

		const BRHumanDate = dateElement?.children?.[0]?.data || ""

		if (BRHumanDate) {
			return DateUtil.turnBRHumanDateIntoDate(BRHumanDate)
		} else {
			return null
		}
	}

	private getSpoilerInfoStatusBySpoilerPageHTML (html: string): SpoilerInfo["status"] {
		const [titleElement] = CrawlerService.findElements({
			html,
			selector: "#post > header > div.info > h1"
		})

		const title = titleElement?.children?.[0]?.data || ""

		const isSpoilerTitle = title.startsWith("Spoiler")

		if (isSpoilerTitle) {
			return "available"
		}

		const isMangaTitle = title.startsWith("Mangá")

		if (isMangaTitle) {
			return "manga-launched"
		}

		return "not-found"
	}

	private getSpoilerInfoContentBySpoilerPageHTML (html: string): string | null {
		const contentElements = CrawlerService.findElements({
			html,
			selector: "article#post > p"
		})

		const contentParams: string[] = []

		let reachedEndOfSpoilerContent = false
		let reachedStartOfSpoilerContent = false

		const blackListedPhrases = [
			SpoilerContentPhrasesConstant.ALL_SPOILER_IMAGES
		]

		contentElements.forEach((contentElement) => {
			contentElement?.children?.forEach(child => {
				let spoilerContentText = child?.data || child?.children?.[0]?.data || ""

				const isValidSpoilerContent = spoilerContentText.match(/[a-zA-Z]/g)

				if (!reachedStartOfSpoilerContent) {
					reachedStartOfSpoilerContent = spoilerContentText.includes(SpoilerContentPhrasesConstant.START_OF_SPOILER)
				}

				const canProcessSpoilerContent = !reachedEndOfSpoilerContent && isValidSpoilerContent && reachedStartOfSpoilerContent

				if (canProcessSpoilerContent) {
					const isBlackListedContent = blackListedPhrases.some(phrase => spoilerContentText.includes(phrase))

					if (isBlackListedContent) {
						spoilerContentText = ""
					}

					if (spoilerContentText) {
						const sanitizedSpoilerContentText = SanitizationUtil.sanitizeSpoilerContent(spoilerContentText)

						contentParams.push(sanitizedSpoilerContentText)
					}
				}

				if (!reachedEndOfSpoilerContent) {
					reachedEndOfSpoilerContent = spoilerContentText.includes(SpoilerContentPhrasesConstant.END_OF_SPOILER)
				}
			})
		})

		const isThereAnyContent = contentParams?.length > 0

		if (isThereAnyContent) {
			return contentParams.join(". ")
		} else {
			return null
		}
	}
}

export default new OpexService()
