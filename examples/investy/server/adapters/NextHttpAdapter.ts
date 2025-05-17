import { NextApiRequest, NextApiResponse } from "next"

import {
	ApiHandler,
	ApiHandlerInput,
	ApiHandlerRequest,
	ApiHandlerResponse,
	DefaultData,
	HttpContract
} from "@server/contracts/HttpContract"

import {
	RawApiHandler,
	ApiHandlerMethod
} from "@server/protocols/NextHttpProtocol"
import { PartialMap } from "@server/protocols/UtilityProtocol"

import LogService from "@server/services/LogService"

class NextHttpAdapter implements HttpContract<RawApiHandler> {
	adaptApiHandler (handler: ApiHandler): RawApiHandler {
		return async (req: NextApiRequest, res: NextApiResponse) => {
			const input: ApiHandlerInput<{}, {}, {}> = {
				request: this.adaptApiHandlerRequest(req),
				response: this.adaptApiHandlerResponse(res),
				context: (req as any).context
			}
	
			try {
				return await handler(input)
			} catch (error) {
				LogService.error(error)
				return input.response.serverError()
			}
		}
	}

	createApiHandlerRoute (methodHandlers: PartialMap<ApiHandlerMethod, RawApiHandler[]>): RawApiHandler {
		return async (req: NextApiRequest, res: NextApiResponse) => {
			const method = String(req.method).toLowerCase()
			const rawHandlers = (methodHandlers[method] || []) as RawApiHandler[]

			for (const rawHandler of rawHandlers) {
				await rawHandler(req, res)

				if (res.finished) {
					break
				}
			}
		}
	}

	private adaptApiHandlerRequest<Query = DefaultData, Body = DefaultData, Params = DefaultData> (req: NextApiRequest): ApiHandlerRequest<Query, Body, Params> {
		return {
			body: req.body,
			params: req.query as any,
			query: req.query as any,
			headers: {
				get: (key) => req.headers[key] as string
			},
			context: {
				set: (data) => {
					(req as any).context = {
						...((req as any).context || {}),
						...data
					}
				}
			}
		}
	}

	private adaptApiHandlerResponse<Query = DefaultData, Body = DefaultData, Params = DefaultData> (res: NextApiResponse): ApiHandlerResponse<Query, Body, Params> {
		return {
			ok: (data) => res.status(200).json(data),
			serverError: (slug) => res.status(500).json({ error: slug || "Server error" }),
			notFound: (message) => res.status(404).send(message || "Not Found"),
			badRequest: (fieldErrors) => res.status(400).json({ fieldErrors }),
			created: (data) => res.status(201).json(data),
			noContent: () => res.status(204).send(""),
			unauthorized: () => res.status(401).json({ error: "Unauthorized" }),
			forbidden: () => res.status(403).json({ error: "Access Denied" }),
			next: () => {}
		}
	}
}

export default new NextHttpAdapter()
