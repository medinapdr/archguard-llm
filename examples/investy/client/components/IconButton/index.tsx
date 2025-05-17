import { ButtonHTMLAttributes, FC } from "react"
import { mergeClassNames, conditionalClassNames, defaultTransitionClassName } from "@client/utils/style"

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const IconButton: FC<IconButtonProps> = (props) => {
	const {
		children,
		className,
		disabled,
		...rest
	} = props

	const needToDisable = disabled

	return (
		<button
			className={mergeClassNames([
				"hover:bg-gray-50 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center",
				defaultTransitionClassName,
				conditionalClassNames(needToDisable, ["cursor-not-allowed", "bg-gray-50"]),
				className
			])}
			disabled={needToDisable}
			{...rest}
		>
			{children}
		</button>
	)
}

export default IconButton
