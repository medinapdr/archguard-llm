import { FC } from "react"

import { PageName, routeConfig } from "@client/config/route"

import LoginPage from "@client/pages/Login"
import SignupPage from "@client/pages/Signup"
import NotionAssetSyncsPage from "@client/pages/AssetSyncs/Notion"

import Redirect from "@client/components/Redirect"

import { wrapPrivateRouteElement, wrapPublicRouteElement } from "@client/utils/route"

const Routes: Record<PageName, FC> = {
	root: wrapPrivateRouteElement(<Redirect to={routeConfig.notionAssetSyncs.path} />),
	assetSyncs: wrapPrivateRouteElement(<Redirect to={routeConfig.notionAssetSyncs.path} />),
	integrations: wrapPrivateRouteElement(<Redirect to={routeConfig.notionAssetSyncs.path} />),
	login: wrapPublicRouteElement(<LoginPage />),
	signup: wrapPublicRouteElement(<SignupPage />),
	notionAssetSyncs: wrapPrivateRouteElement(<NotionAssetSyncsPage />)
}

export default Routes
