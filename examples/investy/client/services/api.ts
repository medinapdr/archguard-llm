import axios from "axios"

import { apiConfig } from "@client/config/api"
import { authConfig } from "@client/config/auth"

import { getAuthToken, logoutAndRedirect } from "@client/services/auth"

import { getErrorResponseStatusCode } from "@client/utils/api"

export const api = axios.create({
	baseURL: apiConfig.baseURL
})

api.interceptors.request.use(async config => {
	config.headers[authConfig.authTokenKey] = getAuthToken()

	return config
})

api.interceptors.response.use(async requestConfig => requestConfig, async error => {
	const statusCode = getErrorResponseStatusCode(error)

	if (statusCode) {
		logoutAndRedirect()
	}

	return Promise.reject(error)
})
