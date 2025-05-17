import { serializeError } from "serialize-error"

import { SerializedError } from "@server/protocols/ErrorSerializationProtocol"

class ErrorSerializationUtil {
	serialize (error: Error): SerializedError {
		return serializeError(error)
	}
}

export default new ErrorSerializationUtil()
