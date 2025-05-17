export type RouteInfo = {
	path: string
	title: string
}

export type PageName = "root" | "login" | "signup" | "assetSyncs" | "notionAssetSyncs" | "integrations"

export const routeConfig: Record<PageName, RouteInfo> = {
	root: {
		path: "/",
		title: "Home"
	},
	login: {
		path: "/login",
		title: "Login"
	},
	signup: {
		path: "/signup",
		title: "Signup"
	},
	assetSyncs: {
		path: "/asset-syncs",
		title: "Asset Syncs"
	},
	notionAssetSyncs: {
		path: "/asset-syncs/notion",
		title: "Notion"
	},
	integrations: {
		path: "/integrations",
		title: "Integrations"
	}
}
