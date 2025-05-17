import { FC } from "react"

type InputLabelProps = {
	inputName: string
}

const InputLabel: FC<InputLabelProps> = (props) => {
	const {
		inputName,
		children
	} = props

	return (
		<label
			className="block text-gray-900 text-sm font-medium mb-2"
			htmlFor={inputName}
		>
			{children}
		</label>
	)
}

export default InputLabel
