class QueueProcessException extends Error {
	constructor (message: string) {
		super(message)

		this.name = "QueueProcessException"
	}
}

export default QueueProcessException
