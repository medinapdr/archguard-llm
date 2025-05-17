import { FC, Children, ReactElement } from "react"

import { isLastItem } from "@client/utils/array"
import { cloneElementSafely } from "@client/utils/node"

const TableBody: FC = (props) => {
	const { children } = props

	const childrenCount = Children.count(children)

	return (
		<tbody>
			{Children.map(children, (child, index) => (
				cloneElementSafely(child as ReactElement, {
					className: isLastItem(index, childrenCount) ? "" : "border-b border-gray-50"
				})
			))}
		</tbody>
	)
}

export default TableBody
