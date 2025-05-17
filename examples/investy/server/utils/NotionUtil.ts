import { RawDatabase, RawPage, RawProperty, Database, DatabaseRow, DatabaseColumn } from "@server/protocols/NotionProtocol"

class NotionUtil {
	serializeDatabase (database: RawDatabase): Database {
		const columns: Database["columns"] = Object.values(database.properties).map(property => ({
			id: property.id,
			name: property.name,
			type: property.type
		}))
	
		return {
			id: database.id,
			cover: database.cover?.url ?? null,
			icon: null,
			title: database.title?.[0]?.text?.content,
			url: database.url,
			columns
		}
	}

	serializeDatabaseRow (page: RawPage): DatabaseRow {
		const columns: DatabaseRow["columns"] = Object.entries(page.properties).map(([propertyName, propertyContent]) => {
			const propertyType = propertyContent?.type

			let value: string

			if (propertyType === "title") {
				value = propertyContent?.title?.[0]?.text?.content
			} else {
				value = propertyContent?.[propertyType]
			}

			return {
				...this.serializeProperty(propertyContent as any),
				name: propertyName,
				value
			}
		})

		return {
			id: page.id,
			columns
		}
	}

	private serializeProperty (property: RawProperty): DatabaseColumn {
		return {
			id: property.id,
			name: property.name,
			type: property.type
		}
	}
}

export default new NotionUtil()
