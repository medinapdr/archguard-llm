import { DefaultValidation, Validation, ValidationResult } from "@server/protocols/ValidationProtocol"

class ValidationUtil {
	async validate<Data> (data: Data, fieldValidations: Record<keyof Data, Validation[]>): Promise<ValidationResult<Data>>  {
		const validationResult: ValidationResult<Data> = {
			valid: true,
			fieldErrors: {},
			data
		}

		await Promise.all(
			Object.entries(fieldValidations).map(async ([field, validations]: [string, Validation[]]) => {
				const fieldValue = data[field]

				for (const validation of validations) {
					const isValid = await validation.isValid(fieldValue)

					if (!isValid) {
						validationResult.valid = false
						validationResult.fieldErrors[field] = validation.errorCode
						break
					}
				}
			})
		)

		return validationResult
	}

	get defaultValidations (): Record<DefaultValidation, Validation> {
		return {
			wasSupplied: {
				errorCode: "FieldNotSupplied",
				isValid: (value) => {
					if (value === null || value === undefined || value === "null" || value === "undefined" || value?.length === 0) {
						return false
					}
			
					return true
				}
			}
		}
	}
}

export default new ValidationUtil()
