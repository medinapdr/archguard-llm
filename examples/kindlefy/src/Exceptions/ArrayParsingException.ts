export class ArrayParsingException extends Error {
	constructor (value: string, initialError: Error) {
		super(`Failed to turn "${value}" into an array. ${initialError.message}`)
	}
}
