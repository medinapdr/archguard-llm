import { ApiHandlerInput } from "@server/contracts/HttpContract"

import Infra from "@server/infra"

/**
 * WARNING:
 * - In Next.JS we need to initialize all the infrastructure resources
 * since every route runs inside a serverless application.
 */
class InfraMiddleware {
	async setup ({ response }: ApiHandlerInput<{}, {}, {}>): Promise<void> {
		await Infra.setup()

		return response.next()
	}
}

export default new InfraMiddleware()
