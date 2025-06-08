export class FileNotFound extends Error {
	constructor () {
		super("File was not found, make sure you supplied the correct path.")
	}
}
