import IdentificationUtil from "@server/utils/IdentificationUtil"

import mongoose, { Schema, SchemaDefinitionProperty, SchemaOptions, Model, InferSchemaType } from "mongoose"

class MongooseUtil {
	get schemaIdDefinition (): SchemaDefinitionProperty {
		return {
			type: String,
			default: IdentificationUtil.generateUUID
		}
	}

	get schemaOptions (): SchemaOptions {
		return {
			timestamps: {
				createdAt: "created_at",
				updatedAt: "updated_at"
			},
			virtuals: true
		}
	}

	compileSchemaIfNeeded<Definition extends Schema>(name: string, definition: Definition): Model<InferSchemaType<Definition>> {
		return mongoose.models[name] || mongoose.model(name, definition)
	}
}

export default new MongooseUtil()
