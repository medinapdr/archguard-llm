import IntegrationEntity from "@server/entities/IntegrationEntity"

import IntegrationRepository from "@server/repositories/IntegrationRepository"

class IntegrationService {
	async getNotionIntegration (userId: string): Promise<IntegrationEntity | null> {
		return await IntegrationRepository.retrieveOne({
			type: "notion",
			user_id: userId
		})
	}
}

export default new IntegrationService()
