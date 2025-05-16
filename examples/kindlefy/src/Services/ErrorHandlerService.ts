class ErrorHandlerService {
	handle (error: Error): void {
		console.error(error)
	}
}

export default new ErrorHandlerService()
