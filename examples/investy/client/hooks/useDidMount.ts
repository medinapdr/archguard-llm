import { useEffect } from "react"

const useDidMount = (callbackFn: () => Promise<void> | void) => {
	useEffect(() => {
		callbackFn()
	// eslint-disable-next-line
	}, [])
}

export default useDidMount
