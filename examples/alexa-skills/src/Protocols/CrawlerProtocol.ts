export type FindElementsInput = {
	html: string
	selector: string
}

export type FindChildElementInput = {
	currentElement: Element
	selector: {
		type: "class" | "tag"
		value: string
	}
}

export type Element = {
	attribs: {
		class: string
		href: string
	}
	type: "text"
	data: string
	name: "a" | "td" | "strong"
	lastChild: Element
	children: Element[]
}
