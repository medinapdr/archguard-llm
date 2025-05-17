import { Children, FC, ReactElement } from "react"

import { cloneElementSafely, DefaultElementProps } from "@client/utils/node"

const DropdownTrigger: FC = (props) => {
	const { children, ...rest } = props

	return (
		<>
			{cloneElementSafely(Children.only(children) as ReactElement, rest as DefaultElementProps)}
		</>
	)
}

DropdownTrigger.displayName = "DropdownTrigger"

export default DropdownTrigger
