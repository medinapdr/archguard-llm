import mongoose, { Document, Schema, Model } from "mongoose"

import UserEntity from "@server/entities/UserEntity"

import MongooseUtil from "@server/utils/MongooseUtil"

export const UserSchemaName = "User"

type UserDocument = Document & UserEntity

type UserModel = Model<UserDocument>

export const UserSchemaDefinition = new Schema<UserDocument, UserModel>({
	_id: MongooseUtil.schemaIdDefinition,
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		index: true
	},
	password: {
		type: String,
		required: true
	},
	picture_url: {
		type: String,
		required: false
	}
}, MongooseUtil.schemaOptions)

// AssetSyncSchemaDefinition.virtual("asset_syncs", { ref: AssetSyncSchemaName, foreignField: "user_id" })
// AssetSyncSchemaDefinition.virtual("integrations", { ref: IntegrationSchemaName, foreignField: "user_id" })

export default MongooseUtil.compileSchemaIfNeeded(UserSchemaName, UserSchemaDefinition)
