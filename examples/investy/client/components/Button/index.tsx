import { ButtonHTMLAttributes, FC } from "react"
import { mergeClassNames, conditionalClassNames, defaultTransitionClassName } from "@client/utils/style"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant: "primary" | "secondary"
	fullWidth?: boolean
	loading?: boolean
}

const backgroundColorClassName: Record<ButtonProps["variant"], string> = {
	primary: "bg-green-900 border border-green-900 hover:bg-[#12bc6a] hover:border-[#12bc6a] text-white",
	secondary: "border border-2 border-gray-100 text-gray-300 hover:bg-gray-100 hover:text-white"
}

const Button: FC<ButtonProps> = (props) => {
	const {
		variant,
		children,
		fullWidth,
		className,
		loading,
		disabled,
		...rest
	} = props

	const needToDisable = disabled || loading

	return (
		<button
			className={mergeClassNames([
				"py-1 px-3 inline-flex items-center justify-center rounded-lg min-h-[40px] font-bold",
				defaultTransitionClassName,
				conditionalClassNames(!needToDisable, [backgroundColorClassName[variant]]),
				conditionalClassNames(fullWidth, ["w-full"]),
				conditionalClassNames(needToDisable, ["cursor-not-allowed", "bg-gray-400"]),
				className
			])}
			disabled={needToDisable}
			{...rest}
		>
			{children}

			{loading && (
				<svg
					className="w-5 h-5 ml-2 -mr-1 text-white animate-spin "
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}
		</button>
	)
}

export default Button
