import { ValidationResult } from "@server/protocols/ValidationProtocol"

import ValidationUtil from "@server/utils/ValidationUtil"

export type AccountData = {
    name: string
}

class Account {
    async validateAccountData (data: AccountData): Promise<ValidationResult<AccountData>> {
        return await ValidationUtil.validate(data, {
            name: [
                ValidationUtil.defaultValidations.wasSupplied
            ]
        })
    }
}

export default new Account()
