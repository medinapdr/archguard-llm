import { ValidationResult } from "@server/protocols/ValidationProtocol"
import { IntegrationType } from "@server/entities/IntegrationEntity"

import ValidationUtil from "@server/utils/ValidationUtil"

export type CreateBody = {
	type: IntegrationType
	token: string
}

class IntegrationValidation {
	async validateCreateData (data: CreateBody): Promise<ValidationResult<CreateBody>> {
		return await ValidationUtil.validate(data as CreateBody, {
			type: [
				ValidationUtil.defaultValidations.wasSupplied
			],
			token: [
				ValidationUtil.defaultValidations.wasSupplied
			]
		})
	}
}

export default new IntegrationValidation()
