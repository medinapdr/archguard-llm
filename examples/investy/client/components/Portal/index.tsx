import { FC } from "react"
import ReactDOM from "react-dom"

type PortalProps = {
	container?: Element
}

const Portal: FC<PortalProps> = (props) => {
	const {
		children,
		container
	} = props

	return (
		<>
			{container && (
				ReactDOM.createPortal(children, container)
			)}
		</>
	)
}

export default Portal
