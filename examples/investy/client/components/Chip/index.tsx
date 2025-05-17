import { mergeClassNames } from "@client/utils/style"
import { FC } from "react"

type ChipProps = {
	variant?: "success" | "error" | "warning"
	className?: string
}

const colorClassName: Record<ChipProps["variant"], string> = {
	success: "bg-[#DEf7EC] text-[#03543F]",
	error: "bg-[#FDE8E8] text-[#9B1C1C]",
	warning: "bg-[#FDF6B2] text-[#723B13]"
}

const Chip: FC<ChipProps> = (props) => {
	const { children, variant, className } = props

	return (
		<span
			className={mergeClassNames([
				"text-xs font-bold mr-2 px-2.5 py-0.5 rounded",
				colorClassName[variant],
				className
			])}
		>
			{children}
		</span>
	)
}

export default Chip
