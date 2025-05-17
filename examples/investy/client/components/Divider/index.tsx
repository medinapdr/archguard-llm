type DividerProps = {
	orientation: "vertical" | "horizontal"
	size: "xs" | "sm" | "md" | "lg"
}

const className: Record<`${DividerProps["orientation"]}|${DividerProps["size"]}`, string> = {
	"horizontal|xs": "h-2",
	"horizontal|sm": "h-4",
	"horizontal|md": "h-8",
	"horizontal|lg": "h-12",
	"vertical|xs": "h-2",
	"vertical|sm": "h-4",
	"vertical|md": "h-8",
	"vertical|lg": "h-12",
}

const Divider = (props: DividerProps) => {
	const {
		size,
		orientation
	} = props

	return (
		<div className={className[`${orientation}|${size}`]} />
	)
}

export default Divider
