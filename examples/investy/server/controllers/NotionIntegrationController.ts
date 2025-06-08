import { ApiHandlerInput } from "@server/contracts/HttpContract"

import NotionLib from "@server/lib/NotionLib"

import IntegrationService from "@server/services/IntegrationService"

import UserRepository from "@server/repositories/UserRepository"

type SearchDatabaseQuery = {
	name: string
}

class NotionIntegrationController {
	async searchDatabase ({ request, response, context }: ApiHandlerInput<SearchDatabaseQuery, {}, {}>): Promise<void> {
		const userId = context.auth.userId
		const name = request.query.name

		const notionIntegration = await IntegrationService.getNotionIntegration(userId)

		if (!notionIntegration) {
			return response.notFound("NotionIntegrationNotFound")
		}

		const notion = new NotionLib(notionIntegration.token)

		if (!name) {
			return response.ok([])
		}

		const databases = await notion.searchDatabases(name)

		await UserRepository.update(userId, { active: true })

		return response.ok(databases)
	}
}

export default new NotionIntegrationController()
