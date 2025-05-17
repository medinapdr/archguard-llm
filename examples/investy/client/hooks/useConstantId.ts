import { useRef } from "react"
import crypto from "crypto"

/**
 * Use this hook in order to create an unique id during
 * component first render. This value is constant until the component
 * is unmounted.
 */
const useConstantId = (): string => {
	const ref = useRef(crypto.randomBytes(16).toString("hex"))

	return ref.current
}

export default useConstantId
