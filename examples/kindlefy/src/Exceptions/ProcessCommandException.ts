import { ExecException } from "child_process"

export class ProcessCommandException extends Error {
	stdout: string
	stderr: string
	error: ExecException

	constructor (error: ExecException, stdout: string, stderr: string) {
		super(error.message)

		this.name = error.name
		this.error = error
	}
}
