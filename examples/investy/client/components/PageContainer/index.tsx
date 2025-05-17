import { FC } from "react"

const PageContainer: FC = (props) => (
	<div className="fixed inset-0 flex justify-center p-4">
		{props.children}
	</div>
)

export default PageContainer
