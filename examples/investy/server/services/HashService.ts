import * as bcrypt from "bcrypt"

import LogService from "@server/services/LogService"

class HashService {
	constructor (
		private readonly saltRounds: number
	) {}

	async makeHash (value: string): Promise<string> {
		return await bcrypt.hash(value.toString(), this.saltRounds)
	}

	async isHashValid (originalValue: string, hash: string): Promise<boolean> {
		try {
			return await bcrypt.compare(originalValue.toString(), hash.toString())
		} catch (error) {
			LogService.error(error)
			return false
		}
	}
}

export default HashService
