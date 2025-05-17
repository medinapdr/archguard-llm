import IntegrationController from "@server/controllers/IntegrationController"

import AuthMiddleware from "@server/middlewares/AuthMiddleware"
import InfraMiddleware from "@server/middlewares/InfraMiddleware"

import NextHttpAdapter from "@server/adapters/NextHttpAdapter"

export default NextHttpAdapter.createApiHandlerRoute({
	post: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup),
		NextHttpAdapter.adaptApiHandler(AuthMiddleware.requireAuth),
		NextHttpAdapter.adaptApiHandler(IntegrationController.create)
	]
})
