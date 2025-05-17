import UserController from "@server/controllers/UserController"

import InfraMiddleware from "@server/middlewares/InfraMiddleware"

import NextHttpAdapter from "@server/adapters/NextHttpAdapter"

export default NextHttpAdapter.createApiHandlerRoute({
	post: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup),
		NextHttpAdapter.adaptApiHandler(UserController.signup)
	]
})
