import { ValidationResult } from "@server/protocols/ValidationProtocol"

import ValidationUtil from "@server/utils/ValidationUtil"

export type NotionBody = {
	databaseId: string
	assetCodePropertyId: string
	assetPricePropertyId: string
}

class NotionAssetSyncValidation {
	async validateNotionData (data: NotionBody): Promise<ValidationResult<NotionBody>> {
		return await ValidationUtil.validate(data, {
			assetCodePropertyId: [
				ValidationUtil.defaultValidations.wasSupplied
			],
			assetPricePropertyId: [
				ValidationUtil.defaultValidations.wasSupplied
			],
			databaseId: [
				ValidationUtil.defaultValidations.wasSupplied
			]
		})
	}
}

export default new NotionAssetSyncValidation()
