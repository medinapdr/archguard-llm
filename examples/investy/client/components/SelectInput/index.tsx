import { FC, SelectHTMLAttributes } from "react"

import { mergeClassNames, conditionalClassNames } from "@client/utils/style"

import useSubComponents, { attachSubComponents, buildSubComponents } from "@client/hooks/useSubComponents"

import SelectInputOption from "@client/components/SelectInput/SelectInputOption"

const EMPTY_OPTION_VALUE = ""

const SubComponents = buildSubComponents({
	Option: SelectInputOption
})

type SelectInputProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "type"> & {
	fullWidth?: boolean
	name?: string
	value?: string
	onValueChange?: (value: string) => void
	errorMessage?: string
	placeholder?: string
}

const SelectInput: FC<SelectInputProps> = (props) => {
	const {
		fullWidth,
		value,
		onValueChange,
		name,
		errorMessage,
		className,
		children,
		placeholder,
		...rest
	} = props

	const subComponents = useSubComponents(children, SubComponents)

	return (
		<>
			<select
				className={mergeClassNames([
					"appearance-none border border-gray-200 rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-green-900 focus:border-green-900",
					conditionalClassNames(fullWidth, ["w-full"]),
					conditionalClassNames(Boolean(errorMessage), ["border-red-500"]),
					conditionalClassNames(value === EMPTY_OPTION_VALUE, ["text-gray-300"]),
					className
				])}
				id={name}
				value={value}
				onChange={({ target }) => onValueChange(target.value)}
				{...rest}
			>
				{placeholder && (
					<SelectInputOption
						disabled
						value={EMPTY_OPTION_VALUE}
					>
						{placeholder}
					</SelectInputOption>
				)}

				{subComponents.Option}
			</select>

			{errorMessage && (
				<p
					className="text-red-500 text-xs italic"
				>
					{errorMessage}
				</p>
			)}
		</>
	)
}

export default attachSubComponents(SelectInput, SubComponents)
