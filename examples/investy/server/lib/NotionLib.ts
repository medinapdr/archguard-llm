import { Client } from "@notionhq/client"

import { Database, RawDatabase, RawPage, DatabaseRow } from "@server/protocols/NotionProtocol"

import NotionUtil from "@server/utils/NotionUtil"

import AssetSyncRepository from "@server/repositories/AssetSyncRepository"

class NotionLib {
	private readonly client: Client

	constructor (token: string) {
		this.client = new Client({ auth: token })
	}

	async getAssetSyncById (assetSyncId: string) {
		return await AssetSyncRepository.retrieveOneById(assetSyncId)
	}

	async searchDatabases (filter: string): Promise<Database[]> {
		const response = await this.client.search({
			filter: {
				property: "object",
				value: "database"
			},
			query: filter
		})

		const databases = response.results.map(database => NotionUtil.serializeDatabase(database as RawDatabase))

		return databases
	}

	async getDatabase (databaseId: string): Promise<Database | null> {
		try {
			const database = await this.client.databases.retrieve({ database_id: databaseId })
	
			return NotionUtil.serializeDatabase(database as RawDatabase)
		} catch (error) {
			return null
		}
	}

	async getDatabaseRows (databaseId: string): Promise<DatabaseRow[]> {
		const database = await this.client.databases.query({
			database_id: databaseId
		})
		
		const databaseRows = database.results.map(page => NotionUtil.serializeDatabaseRow(page as RawPage))

		return databaseRows
	}

	async updateDatabaseRow (columnId: string, rowId: string, value: number): Promise<void> {
		await this.client.pages.update({
			properties: {
				[columnId]: {
					type: "number",
					number: value
				}
			},
			page_id: rowId
		})
	}
}

export default NotionLib
