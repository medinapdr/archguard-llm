class ValidatorUtil {
	validate (data, fieldNameToValidators) {
		const result = {
			isValid: true,
			messages: {}
		}

		Object.entries(fieldNameToValidators).forEach(([fieldName, validators]) => {
			for (const validator of validators) {
				const { errorMessage, handler } = validator

				const isValid = handler(data[fieldName])

				if (!isValid) {
					result.messages[fieldName] = errorMessage
					result.isValid = false

					break
				}
			}
		})

		return result
	}
}

module.exports = new ValidatorUtil()
