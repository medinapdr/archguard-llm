import { Document, Schema, Model } from "mongoose"

import MongooseUtil from "@server/utils/MongooseUtil"

export const AccountSchemaName = "Account"

type AccountDocument = Document

type AccountModel = Model<AccountDocument>

export const AccountSchemaDefinition = new Schema<AccountDocument, AccountModel>({
	_id: MongooseUtil.schemaIdDefinition,
	name: {
		type: String,
		required: true
	},
}, MongooseUtil.schemaOptions)

export default MongooseUtil.compileSchemaIfNeeded(AccountSchemaName, AccountSchemaDefinition)
