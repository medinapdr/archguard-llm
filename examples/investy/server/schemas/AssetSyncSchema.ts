import { Document, Schema, Model } from "mongoose"

import AssetSyncEntity from "@server/entities/AssetSyncEntity"

import { UserSchemaName } from "@server/schemas/UserSchema"
import { IntegrationSchemaName } from "@server/schemas/IntegrationSchema"

import MongooseUtil from "@server/utils/MongooseUtil"

export const AssetSyncSchemaName = "AssetSync"

type AssetSyncDocument = Document & AssetSyncEntity

type AssetSyncModel = Model<AssetSyncDocument>

export const AssetSyncSchemaDefinition = new Schema<AssetSyncDocument, AssetSyncModel>({
	_id: MongooseUtil.schemaIdDefinition,
	user_id: {
		type: String,
		ref: UserSchemaName,
		required: true,
		index: true,
	},
	integration_id: {
		type: String,
		ref: IntegrationSchemaName,
		required: true,
		index: true
	},
	extra_data: {
		type: Object,
		required: false
	},
	last_sync_at: {
		type: Date,
		required: false
	},
	last_sync_status: {
		type: String,
		required: false
	},
	last_sync_error: {
		type: Object,
		required: false
	}
}, MongooseUtil.schemaOptions)

// AssetSyncSchemaDefinition.virtual("user", { ref: UserSchemaName, localField: "user_id", foreignField: "_id", justOne: true })
// AssetSyncSchemaDefinition.virtual("integration", { ref: IntegrationSchemaName, localField: "integration_id", foreignField: "_id", justOne: true })

export default MongooseUtil.compileSchemaIfNeeded(AssetSyncSchemaName, AssetSyncSchemaDefinition)
