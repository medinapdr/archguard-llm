import { AxiosError } from "axios"

export const getErrorResponseStatusCode = (error: AxiosError) => {
	return error?.response?.status
}
