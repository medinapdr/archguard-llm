import cheerio from "cheerio"

import {
	FindElementsInput,
	FindChildElementInput,
	Element
} from "@/Protocols/CrawlerProtocol"

class CrawlerService {
	findChildElement (input: FindChildElementInput): Element {
		const { currentElement, selector } = input

		let selectedElement: any

		let isCurrentElementSelected = false

		if (selector.type === "class") {
			const value = currentElement?.attribs?.class || ""

			isCurrentElementSelected = value?.includes(selector.value)
		} else if (selector.type === "tag") {
			const value = currentElement?.name || ""

			isCurrentElementSelected = value === selector.value
		} else {
			return null
		}

		if (isCurrentElementSelected) {
			selectedElement = currentElement
		} else {
			const children = currentElement?.children || []

			children.forEach((child) => {
				const childSelectedElement = this.findChildElement({ currentElement: child, selector })

				if (childSelectedElement) {
					selectedElement = childSelectedElement
				}
			})
		}

		return selectedElement
	}

	findElements (input: FindElementsInput): Element[] {
		const { html, selector } = input

		const $ = cheerio.load(html)

		const elements = $(selector).toArray() as any

		return elements
	}
}

export default new CrawlerService()
