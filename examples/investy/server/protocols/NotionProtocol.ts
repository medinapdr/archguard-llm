import { Client } from "@notionhq/client"

import { Awaited } from "@server/protocols/UtilityProtocol"

export type RawDatabase = Awaited<ReturnType<Client["databases"]["retrieve"]>> & {
	cover: {
		url: string
	}
	title: [{ text: { content: string } }]
	url: string
	parent: {
		page_id: string
	}
}

export type RawPage = Awaited<ReturnType<Client["pages"]["retrieve"]>> & {
	properties: Record<string, {
		id: string
		type: string
		title: [{ text: { content: string } }]
	}>
}

export type RawProperty = {
	id: string
	name: string
	type: string
}

export type DatabaseColumn = {
	id: string
	name: string
	type: "number"
}

export type Database = {
	id: string
	cover: string
	icon: string
	title: string
	url: string
	columns: DatabaseColumn[]
}

export type DatabaseColumnDetail = DatabaseColumn & {
	value: string
}

export type DatabaseRow = {
	id: string
	columns: DatabaseColumnDetail[]
}
