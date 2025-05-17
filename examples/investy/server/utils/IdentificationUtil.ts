import { v4 } from "uuid"

class IdentificationUtil {
	generateUUID (): string {
		const uuid = v4()

		return uuid
	}
}

export default new IdentificationUtil()
