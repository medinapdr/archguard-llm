import mongoose from "mongoose"

import LogService from "@server/services/LogService"

import DatabaseConfig from "@server/config/DatabaseConfig"

class DatabaseModule {
	async start (): Promise<void> {
		const { host, password, port, user, name } = DatabaseConfig

		let mongoUserPass = ""

		if (user) {
			mongoUserPass = `${user}:${password}@`
		}

		const url = new URL(`mongodb://${mongoUserPass}${host}:${port}/${name}`)
		
		await mongoose.connect(url.href, { retryWrites: false })

		mongoose.set("strictQuery", true)
		
		LogService.info(`[Core] Initialized a new database connection... (${url.href})`)
	}
}

export default new DatabaseModule()
