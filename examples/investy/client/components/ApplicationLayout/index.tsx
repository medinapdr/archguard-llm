import { FC } from "react"
import Image from "next/image"
import {
	RefreshCw as AssetSyncIcon,
	Puzzle as IntegrationIcon
} from "lucide-react"

import { routeConfig } from "@client/config/route"

import AsideMenu from "@client/components/ApplicationLayout/AsideMenu"
import MenuItem from "@client/components/ApplicationLayout/MenuItem"
import Breadcrumb from "@client/components/ApplicationLayout/Breadcrumb"

import Divider from "@client/components/Divider"
import Link from "@client/components/Link"

import AppLogoSvg from "@client/assets/app/app_logo.svg"

const ApplicationLayout: FC = (props) => {
	const { children } = props

	return (
		<>
			<AsideMenu>
				<Divider orientation="horizontal" size="sm" />

				<Link
					href={routeConfig.root.path}
					className="flex items-start justify-items-start"
				>
					<Image
						src={AppLogoSvg}
						className="h-8 -ml-11"
						alt=""
					/>
				</Link>

				<Divider orientation="horizontal" size="md" />

				<MenuItem
					href={routeConfig.assetSyncs.path}
					icon={<AssetSyncIcon />}
				>
					{routeConfig.assetSyncs.title}
				</MenuItem>

				<Divider orientation="horizontal" size="xs" />

				<MenuItem
					disabled
					href={routeConfig.integrations.path}
					icon={<IntegrationIcon />}
				>
					{routeConfig.integrations.title}
				</MenuItem>
			</AsideMenu>

			<div className="p-2 sm:ml-64">
				<div className="p-2 rounded-lg">
					<Breadcrumb />

					<Divider orientation="horizontal" size="sm" />

					{children}
				</div>
			</div>
		</>
	)
}

export default ApplicationLayout
