import { Queue } from "quirrel/next"

import {
	QueueContract,
	QueueHandler,
	QueuePayload,
	QueueName,
	BaseQueue
} from "@server/contracts/QueueContract"

class QuirrelQueueAdapter extends BaseQueue implements QueueContract<Queue<{}>> {
	adaptQueueHandler (handler: QueueHandler): Queue<{}> {
		const route = `api/queues/${handler.name}`

		const queue = Queue<QueuePayload[QueueName]>(route, async (payload) => await this.process(handler, payload))

		return queue
	}
}

export default new QuirrelQueueAdapter()
