import { cloneElementSafely } from "@client/utils/node"
import { ReactNode, Children, FC, ReactElement } from "react"

import useConstantId from "@client/hooks/useConstantId"

type TooltipProps = {
	content: ReactNode
}

const Tooltip: FC<TooltipProps> = (props) => {
	const { content, children } = props

	const id = useConstantId()

	return (
		<>
			{cloneElementSafely(Children.only(children) as ReactElement, {
				["data-tooltip-target"]: id
			})}

			<div
				id={id}
				role="tooltip"
				className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
			>
				{content}

				<div
					className="tooltip-arrow"
					data-popper-arrow
				/>
			</div>
		</>
	)
}

export default Tooltip
