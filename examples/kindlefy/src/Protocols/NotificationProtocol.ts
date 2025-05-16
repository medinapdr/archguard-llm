export type TaskConfig = {
	setError: (error: Error) => void
	setOutput: (output: string) => void
	setStatus: (status: string) => void
	setWarning: (warning: string) => void
}

export type TaskCallback<Result extends unknown> = (config: TaskConfig) => Promise<Result>
