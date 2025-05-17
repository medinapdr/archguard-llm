import { mergeClassNames } from "@client/utils/style"
import { FC, HTMLAttributes } from "react"

const TableRow: FC<HTMLAttributes<HTMLTableRowElement>> = (props) => {
	const { children, className, ...rest } = props

	return (
		<tr
			{...rest}
			className={mergeClassNames([
				"bg-white",
				className
			])}
		>
			{children}
		</tr>
	)
}

export default TableRow
