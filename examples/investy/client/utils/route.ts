import { routeConfig, RouteInfo } from "@client/config/route"

import useDidMount from "@client/hooks/useDidMount"

import { isAuthenticated, logoutAndRedirect } from "@client/services/auth"

export const getRouteInfo = (where: Pick<RouteInfo, "path">): RouteInfo | null => {
	const routeInfoList = Object.values(routeConfig)

	const selectedRouteInfo = routeInfoList.find(routeInfo => routeInfo.path === where.path)

	return selectedRouteInfo || null
}

export const getRoutesByCurrentPathname = (currentPathname: string): RouteInfo[] => {
	const pathParams: string[] = currentPathname?.split("/") || []

	const routes = pathParams.map((_, index) => {
		const calculatedPath = pathParams.slice(0, index + 1).join("/") || "/"

		const routeInfo: RouteInfo = {
			path: calculatedPath,
			title: "??",
			...getRouteInfo({ path: calculatedPath }) 
		}

		return routeInfo
	})

	return routes
}

export const wrapPublicRouteElement = (routeElement: JSX.Element) => () => routeElement

export const wrapPrivateRouteElement = (routeElement: JSX.Element) => () => {
	useDidMount(() => {
		const hasInvalidAuthentication = !isAuthenticated()

		if (hasInvalidAuthentication) {
			logoutAndRedirect()
		}
	})

	return routeElement
}
