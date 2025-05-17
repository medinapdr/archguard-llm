import { routeConfig } from "@client/config/route"

const AUTH_TOKEN_LOCAL_STORAGE_KEY = "auth-token"

export const setAuthToken = (authToken: string) => {
	localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, authToken)
}

export const clearAuthToken = () => {
	localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)
}

export const getAuthToken = (): string | null => {
	const authToken = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)

	return authToken ?? null
}

export const isAuthenticated = () => {
	return Boolean(getAuthToken())
}

export const loginAndRedirect = (authToken: string) => {
	setAuthToken(authToken)

	window.location.replace(routeConfig.root.path)
}

export const logoutAndRedirect = () => {
	clearAuthToken()

	window.location.replace(routeConfig.login.path)
}
