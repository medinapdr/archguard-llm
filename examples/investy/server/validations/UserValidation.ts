import { ValidationResult } from "@server/protocols/ValidationProtocol"

import ValidationUtil from "@server/utils/ValidationUtil"

import UserRepository from "@server/repositories/UserRepository"

export type SignupBody = {
	name: string
	email: string
	password: string
}

export type LoginBody = {
	email: string
	password: string
}

class UserValidation {
	async validateSignupData (data: SignupBody): Promise<ValidationResult<SignupBody>> {
		return await ValidationUtil.validate(data as SignupBody, {
			email: [
				ValidationUtil.defaultValidations.wasSupplied,
				{
					isValid: this.isUserEmailAvailable,
					errorCode: "UserAlreadyExists"
				}
			],
			name: [
				ValidationUtil.defaultValidations.wasSupplied
			],
			password: [
				ValidationUtil.defaultValidations.wasSupplied
			]
		})
	}

	async validateLoginData (data: LoginBody): Promise<ValidationResult<LoginBody>> {
		return await ValidationUtil.validate(data as LoginBody, {
			email: [
				ValidationUtil.defaultValidations.wasSupplied
			],
			password: [
				ValidationUtil.defaultValidations.wasSupplied
			]
		})
	}

	private async isUserEmailAvailable (email: string): Promise<boolean> {
		const user = await UserRepository.retrieveOne({ email })

		if (user) {
			return false
		} else {
			return true
		}
	}
}

export default new UserValidation()
