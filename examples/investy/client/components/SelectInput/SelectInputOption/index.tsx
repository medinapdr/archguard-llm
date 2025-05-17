import { FC, OptionHTMLAttributes } from "react"

const SelectInputOption: FC<OptionHTMLAttributes<HTMLOptionElement>> = (props) => {
	const { children, ...rest } = props

	return (
		<option
			{...rest}
		>
			{children}
		</option>
	)
}

export default SelectInputOption
