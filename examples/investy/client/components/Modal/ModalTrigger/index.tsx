import { Children, FC, ReactElement } from "react"

import { cloneElementSafely, DefaultElementProps } from "@client/utils/node"

const ModalTrigger: FC = (props) => {
	const { children, ...rest } = props

	return (
		<>
			{cloneElementSafely(Children.only(children) as ReactElement, rest as DefaultElementProps)}
		</>
	)
}

ModalTrigger.displayName = "ModalTrigger"

export default ModalTrigger
