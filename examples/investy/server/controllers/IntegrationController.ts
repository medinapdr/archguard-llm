import { ApiHandlerInput } from "@server/contracts/HttpContract"

import IntegrationRepository from "@server/repositories/IntegrationRepository"

import IntegrationValidation, { CreateBody } from "@server/validations/IntegrationValidation"

class IntegrationController {
	async create ({ request, response, context }: ApiHandlerInput<{}, CreateBody, {}>): Promise<void> {
		const userId = context.auth.userId

		const validation = await IntegrationValidation.validateCreateData(request.body)

		if (!validation.valid) {
			return response.badRequest(validation.fieldErrors)
		}

		const { type, token } = validation.data

		if (!["notion"].includes(type)) {
			return response.badRequest(validation.fieldErrors)
		}

		const integration = await IntegrationRepository.create({
			token,
			type,
			user_id: userId
		})

		return response.created({
			id: integration.id
		})
	}
}

export default new IntegrationController()
