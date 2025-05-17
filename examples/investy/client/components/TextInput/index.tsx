import { InputHTMLAttributes, HTMLInputTypeAttribute } from "react"
import { mergeClassNames, conditionalClassNames } from "@client/utils/style"
import { cloneElementSafely } from "@client/utils/node"

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
	startAdornment?: JSX.Element
	fullWidth?: boolean
	name?: string
	value?: string
	onValueChange?: (value: string) => void
	errorMessage?: string
	type?: Extract<HTMLInputTypeAttribute, "text" | "password">
}

const TextInput = (props: TextInputProps) => {
	const {
		fullWidth,
		value,
		onValueChange,
		name,
		errorMessage,
		className,
		startAdornment,
		...rest
	} = props

	return (
		<div
			className="relative"
		>
			{startAdornment && (
				<div
					className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
				>
					{cloneElementSafely(startAdornment, {
						className: "w-5"
					})}
				</div>
			)}

			<input
				className={mergeClassNames([
					"appearance-none border border-gray-200 rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-green-900 focus:border-green-900",
					conditionalClassNames(fullWidth, ["w-full"]),
					conditionalClassNames(Boolean(errorMessage), ["border-red-500"]),
					conditionalClassNames(Boolean(startAdornment), ["pl-10"]),
					className
				])}
				id={name}
				type="text"
				value={value}
				onChange={({ target }) => onValueChange(target.value)}
				{...rest}
			/>

			{errorMessage && (
				<p
					className="text-red-500 text-xs italic"
				>
					{errorMessage}
				</p>
			)}
		</div>
	)
}

export default TextInput
