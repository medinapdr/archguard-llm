import jwt, { SignOptions } from "jsonwebtoken"

import LogService from "@server/services/LogService"

class CryptService {
	constructor (
		private readonly secret: string
	) {}

	encode<Payload extends Record<string, unknown>>(payload: Payload, options?: SignOptions): string {
		return jwt.sign(payload, this.secret, options)
	}

	decode<Payload extends Record<string, unknown>>(token: string): Payload | null {
		try {
			return jwt.verify(token, this.secret) as Payload
		} catch (error) {
			LogService.error(error)
			return null
		}
	}
}

export default CryptService
