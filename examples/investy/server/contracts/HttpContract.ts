import { PartialMap } from "@server/protocols/UtilityProtocol"
import { AuthTokenPayload } from "@server/protocols/AuthProtocol"

export type DefaultData = Record<string, unknown>

export type ApiHandlerRequest<Query, Body, Params> = {
	params?: Params
	query?: Query
	body: Body
	headers: {
		get: (key: string) => string | null
	}
	context: {
		set: (data: Partial<RequestContext>) => void
	}
}

export type ApiHandlerResponse<Query, Body, Params> = {
	ok: (data?: unknown) => void
	serverError: (slug?: string) => void
	notFound: (message?: string) => void
	badRequest: (fieldErrors: PartialMap<keyof (Query & Body & Params), string>) => void
	created: (data?: unknown) => void
	noContent: () => void
	unauthorized: () => void
	forbidden: () => void
	next: () => void
}

export type RequestContext = {
	auth: AuthTokenPayload
}

export type ApiHandlerInput<Query = DefaultData, Body = DefaultData, Params = DefaultData> = {
	request: ApiHandlerRequest<Query, Body, Params>
	response: ApiHandlerResponse<Query, Body, Params>
	context: RequestContext
}

export type ApiHandler<Query = DefaultData, Body = DefaultData, Params = DefaultData> = (input: ApiHandlerInput<Query, Body, Params>) => Promise<void>

export interface HttpContract<RawApiHandler> {
	adaptApiHandler (handler: ApiHandler): RawApiHandler
}
