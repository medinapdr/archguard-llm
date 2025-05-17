import { FC } from "react"

import { attachSubComponents, buildSubComponents } from "@client/hooks/useSubComponents"

import TableBody from "@client/components/Table/TableBody"
import TableColumn from "@client/components/Table/TableColumn"
import TableHead from "@client/components/Table/TableHead"
import TableRow from "@client/components/Table/TableRow"

const SubComponents = buildSubComponents({
	Body: TableBody,
	Column: TableColumn,
	Head: TableHead,
	Row: TableRow
})

const Table: FC = (props) => {
	const { children } = props

	return (
		<div className="relative overflow-x-auto rounded-lg">
			<table className="w-full text-sm text-left text-gray-500">
				{children}
			</table>
		</div>
	)
}

export default attachSubComponents(Table, SubComponents)
