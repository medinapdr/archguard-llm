import { FC, ThHTMLAttributes } from "react"

import { mergeClassNames } from "@client/utils/style"

const TableColumn: FC<ThHTMLAttributes<HTMLTableCellElement>> = (props) => {
	const { children, className, ...rest } = props

	return (
		<th
			{...rest}
			className={mergeClassNames([
				"px-6 py-3 text-gray-600 font-normal",
				className
			])}
		>
			{children}
		</th>
	)
}

export default TableColumn
