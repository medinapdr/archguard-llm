import { ApiHandlerInput } from "@server/contracts/HttpContract"

import { SignupBody } from "@server/validations/UserValidation"

class Account {
    async isLoggedIn ({ response }: ApiHandlerInput<{}, SignupBody, {}>): Promise<void> {
        return response.ok({ isLoggedIn: true })
    }
}

export default new Account()
