import { useState } from "react"
import { AxiosError } from "axios"

import { validationConfig } from "@client/config/validation"

type FieldErrors = Record<string, string>

const useValidation = () => {
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

	const processFieldErrorMessages = () => {
		const messages: Record<string, string> = {}

		Object.entries(fieldErrors).forEach(([field, error]) => {
			messages[field] = validationConfig.fieldErrorMessages[error]
		})

		return messages
	}

	const processRequestError = (requestError: AxiosError<{ fieldErrors: FieldErrors }>) => {
		const requestFieldErrors = requestError?.response?.data?.fieldErrors

		if (requestFieldErrors) {
			setFieldErrors(requestFieldErrors)
		}
	}

	const clearFieldError = (field: string) => {
		setFieldErrors(lastState => {
			const updatedState = { ...lastState }

			if (field in updatedState) {
				delete updatedState[field]
			}

			return updatedState
		})
	}

	return {
		digestRequestError: processRequestError,
		clearFieldError,
		messages: processFieldErrorMessages()
	}
}

export default useValidation
