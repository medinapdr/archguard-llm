import DatabaseModule from "@server/infra/database"
import QueueModule from "@server/infra/queue"

class Infra {
	private static started = false

	async setup (): Promise<void> {
		if (Infra.started) {
			return
		}

		await DatabaseModule.start()
		await QueueModule.start()

		Infra.started = true
	}
}

export default new Infra()
