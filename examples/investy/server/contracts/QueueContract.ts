import LogService from "@server/services/LogService"

export type QueuePayload = {
	SyncNotionAssetPrice: {
		assetSyncId: string
	}
}

export type QueueName = keyof QueuePayload

export interface QueueHandler {
	name: QueueName
	handle: (data: QueuePayload[QueueName]) => Promise<void>
	onCompleted?: (data: QueuePayload[QueueName]) => Promise<void>
	onActive?: (data: QueuePayload[QueueName]) => Promise<void>
	onError?: (data: QueuePayload[QueueName], error: Error) => Promise<void>
}

export type EnqueueInput<Name extends QueueName> = {
	name: Name
	payload: QueuePayload[Name]
	options: {
		scheduleTimeInMilliseconds?: number
		id?: string
	}
}

export interface QueueContract<RawQueueHandler> {
	adaptQueueHandler: (handler: QueueHandler) => RawQueueHandler
}

export abstract class BaseQueue {
	protected async process (handler: QueueHandler, payload: QueuePayload[QueueName]): Promise<void> {
		try {
			await this.onActive(handler, payload)
			await handler.handle(payload)
			await this.onCompleted(handler, payload)
		} catch (error) {
			await this.onError(handler, payload, error)
		}
	}

	protected async onActive (handler: QueueHandler, payload: QueuePayload[QueueName]): Promise<void> {
		LogService.info(`[Queue][${handler.name}] Running...`)

		await handler?.onActive(payload)?.catch(LogService.error)
	}

	protected async onError (handler: QueueHandler, payload: QueuePayload[QueueName], error: Error): Promise<void> {
		LogService.info(`[Queue][${handler.name}] ERROR!`)
		LogService.error(error)

		setImmediate(() => {
			handler?.onError(payload, error)?.catch(LogService.error)
		})	
	}

	protected async onCompleted (handler: QueueHandler, payload: QueuePayload[QueueName]): Promise<void> {
		LogService.info(`[Queue][${handler.name}] Success!`)

		setImmediate(() => {
			handler?.onCompleted?.(payload)?.catch(LogService.error)
		})
	}
}
