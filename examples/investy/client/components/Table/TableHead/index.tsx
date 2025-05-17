import { FC, Children, ReactElement } from "react"

import { cloneElementSafely } from "@client/utils/node"

const TableHead: FC = (props) => {
	const { children } = props

	return (
		<thead
			className="text-xs uppercase bg-gray-50"
		>
			<tr>
				{Children.map(children, (child) => (
					cloneElementSafely(child as ReactElement, {
						scope: "col",
						className: "font-black"
					})
				))}
			</tr>
		</thead>
	)
}

export default TableHead
