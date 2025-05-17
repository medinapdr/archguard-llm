export type DefaultEntity  = {
	id: string
	updated_at: Date
	created_at: Date
}

export type CreateInput<Entity extends DefaultEntity> = Omit<Entity, "id" | "created_at" | "updated_at">

export type WhereInput<Entity extends DefaultEntity> = Partial<Entity>

export type UpdateInput<Entity extends DefaultEntity> = WhereInput<Entity>

export interface RepositoryContract<Entity extends DefaultEntity> {
	create: (data: CreateInput<Entity>) => Promise<Entity>
	retrieveOne: (where: WhereInput<Entity>) => Promise<Entity | null>
	retrieveOneById: (id: string) => Promise<Entity | null>
	retrieveAll: (where: WhereInput<Entity>) => Promise<Entity[]>
	updateOneById: (id: string, data: UpdateInput<Entity>) => Promise<void>
	updateMany: (where: WhereInput<Entity>, data: UpdateInput<Entity>) => Promise<void>
	deleteMany: (where: WhereInput<Entity>) => Promise<void>
}
