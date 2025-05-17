export type DatabaseColumn = {
	id: string
	name: string
	type: string
}

export type Database = {
	id: string
	cover: string
	icon: string
	title: string
	url: string
	columns: DatabaseColumn[]
}
