import NotionIntegrationController from "@server/controllers/NotionIntegrationController"

import AuthMiddleware from "@server/middlewares/AuthMiddleware"
import InfraMiddleware from "@server/middlewares/InfraMiddleware"

import NextHttpAdapter from "@server/adapters/NextHttpAdapter"

export default NextHttpAdapter.createApiHandlerRoute({
	get: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup),
		NextHttpAdapter.adaptApiHandler(AuthMiddleware.requireAuth),
		NextHttpAdapter.adaptApiHandler(NotionIntegrationController.searchDatabase)
	]
})
