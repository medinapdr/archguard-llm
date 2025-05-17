import { useState } from "react"
import useDidMount from "./useDidMount"

const useWindowObject = (): Window | null => {
	const [windowObject, setWindowObject] = useState<Window | null>(null)

	useDidMount(() => {
		if (window) {
			setWindowObject(window)
		}
	})

	return windowObject
}

export default useWindowObject
