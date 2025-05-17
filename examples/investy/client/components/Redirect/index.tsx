import { useRouter } from "next/router"

import useDidMount from "@client/hooks/useDidMount"

type RedirectProps = {
	to: string
}

const Redirect = (props: RedirectProps) => {
	const { to } = props

	const router = useRouter()

	useDidMount(() => {
		router.replace(to)
	})

	return null
}

export default Redirect
