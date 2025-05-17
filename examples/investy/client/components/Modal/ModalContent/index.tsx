import { ButtonHTMLAttributes, FC } from "react"

import { mergeClassNames } from "@client/utils/style"

const ModalContent: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
	const { children, className, ...rest } = props

	return (
		<>
			{children}
		</>
	)
}

ModalContent.displayName = "ModalContent"

export default ModalContent
