import { ApiHandlerInput } from "@server/contracts/HttpContract"

import AuthService from "@server/services/AuthService"

import UserValidation, { SignupBody, LoginBody } from "@server/validations/UserValidation"

import UserRepository from "@server/repositories/UserRepository"

class UserController {
	async signup ({ request, response }: ApiHandlerInput<{}, SignupBody, {}>): Promise<void> {
		const validation = await UserValidation.validateSignupData(request.body)

		if (!validation.valid) {
			return response.badRequest(validation.fieldErrors)
		}

		const { password, name, email } = validation.data

		const hashedPassword = await AuthService.makeHashedPassword(password)

		const user = await UserRepository.create({
			email,
			name,
			password: hashedPassword
		})

		const authToken = await AuthService.generateAuthToken(user.id)

		return response.created({ authToken })
	}

	async login ({ request, response }: ApiHandlerInput<{}, LoginBody, {}>): Promise<void> {
		const validation = await UserValidation.validateLoginData(request.body)

		if (!validation.valid) {
			return response.badRequest(validation.fieldErrors)
		}

		const { password, email } = validation.data

		const user = await UserRepository.retrieveOne({ email })

		if (!user) {
			return response.badRequest({ email: "InvalidLoginCredentials", password: "InvalidLoginCredentials" })
		}

		const isValidPassword = await AuthService.isValidPassword(password, user.password)

		if (!isValidPassword) {
			return response.badRequest({ email: "InvalidLoginCredentials", password: "InvalidLoginCredentials" })
		}

		const authToken = await AuthService.generateAuthToken(user.id)

		return response.ok({ authToken })
	}
}

export default new UserController()
