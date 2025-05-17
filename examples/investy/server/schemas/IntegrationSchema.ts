import { Document, Schema, Model } from "mongoose"

import IntegrationEntity from "@server/entities/IntegrationEntity"

import { UserSchemaName } from "@server/schemas/UserSchema"

import MongooseUtil from "@server/utils/MongooseUtil"

export const IntegrationSchemaName = "Integration"

type IntegrationDocument = Document & IntegrationEntity

type IntegrationModel = Model<IntegrationDocument>

export const IntegrationSchemaDefinition = new Schema<IntegrationDocument, IntegrationModel>({
	_id: MongooseUtil.schemaIdDefinition,
	user_id: {
		type: String,
		ref: UserSchemaName,
		required: true,
		index: true
	},
	type: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	}
}, MongooseUtil.schemaOptions)

// IntegrationSchemaDefinition.virtual("user", { ref: UserSchemaName, localField: "user_id", foreignField: "_id", justOne: true })

export default MongooseUtil.compileSchemaIfNeeded(IntegrationSchemaName, IntegrationSchemaDefinition)
