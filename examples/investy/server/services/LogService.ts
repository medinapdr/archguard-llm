class LogService {
	error (error: Error): void {
		console.error(error)
	}

	info (text: string): void {
		console.log(text)
	}
}

export default new LogService()
