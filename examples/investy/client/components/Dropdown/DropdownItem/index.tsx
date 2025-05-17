import { ButtonHTMLAttributes, FC } from "react"

import { mergeClassNames } from "@client/utils/style"

const DropdownItem: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
	const { children, className, ...rest } = props

	return (
		<li
			className=""
		>
			<button
				{...rest}
				className={mergeClassNames([
					"px-4 py-2 hover:bg-gray-50 w-full text-left",
					className
				])}
			>
				{children}
			</button>
		</li>
	)
}

DropdownItem.displayName = "DropdownItem"

export default DropdownItem
