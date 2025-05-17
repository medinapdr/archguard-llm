import { Model } from "mongoose"

import {
	RepositoryContract,
	CreateInput,
	WhereInput,
	UpdateInput,
	DefaultEntity
} from "@server/contracts/RepositoryContract"

class MongooseRepositoryAdapter<Entity extends DefaultEntity> implements RepositoryContract<Entity> {
	private readonly schema: Model<Entity>

	constructor (schema: Model<Entity>) {
		this.schema = schema
	}

	async create (data: CreateInput<Entity>): Promise<Entity> {
		const entity = await this.schema.create(data)

		return entity
	}

	async retrieveOne (where: WhereInput<Entity>): Promise<Entity | null> {
		const formattedWhere = this.formatWhere(where)

		const entity = await this.schema.findOne(formattedWhere)

		if (!entity) {
			return null
		}

		return entity
	}

	async retrieveOneById (id: string): Promise<Entity | null> {
		return await this.retrieveOne({ id } as any)
	}

	async retrieveAll (where: WhereInput<Entity>): Promise<Entity[]> {
		const formattedWhere = this.formatWhere(where)

		const entities = await this.schema.find(formattedWhere)

		return entities
	}

	async updateOneById (id: string, data: UpdateInput<Entity>): Promise<void> {
		return await this.updateMany({ id } as any, data)
	}

	async updateMany (where: WhereInput<Entity>, data: UpdateInput<Entity>): Promise<void> {
		const formattedWhere = this.formatWhere(where)

		await this.schema.updateMany(formattedWhere, data)
	}

	async deleteMany (where: WhereInput<Entity>): Promise<void> {
		const formattedWhere = this.formatWhere(where)

		await this.schema.deleteMany(formattedWhere)
	}

	private formatWhere (where: WhereInput<Entity>): WhereInput<Entity> {
		const { id, ...rest } = where

		return {
			...rest,
			...(id && { _id: id }) as any,
		}
	}
}

export default MongooseRepositoryAdapter
