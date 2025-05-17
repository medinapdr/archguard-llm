import { FC } from "react"

import useWindowObject from "@client/hooks/useWindowObject"

import Link from "@client/components/Link"

import { conditionalClassNames, mergeClassNames, defaultTransitionClassName } from "@client/utils/style"
import { getRoutesByCurrentPathname } from "@client/utils/route"

type MenuItemProps = {
	href: string
	icon?: JSX.Element
	disabled?: boolean
}

const MenuItem: FC<MenuItemProps> = (props) => {
	const {
		href,
		icon,
		disabled,
		children
	} = props

	const windowObject = useWindowObject()

	const routes = getRoutesByCurrentPathname(windowObject?.location?.pathname)
	const isSelected = routes.some(route => route.path === href)

	return (
		<li>
			<Link
				href={disabled ? "" : href}
				className={mergeClassNames([
					"flex items-center p-2 text-base font-normal rounded-lg",
					defaultTransitionClassName,
					conditionalClassNames(isSelected, ["bg-green-900", "hover:bg-[#12bc6a]", "text-white"]),
					conditionalClassNames(!isSelected, ["hover:bg-gray-50", "text-gray-900"]),
					conditionalClassNames(disabled, ["cursor-not-allowed", "text-gray-600"]),
				])}
			>
				{icon}

				<span
					className="ml-3"
				>
					{children}
				</span>
			</Link>
		</li>
	)
}

export default MenuItem
