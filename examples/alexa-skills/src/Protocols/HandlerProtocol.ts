import { RequestEnvelope, Response } from "ask-sdk-model"
import { HandlerInput, RequestHandler } from "ask-sdk-core"

export type HandlerEvent = RequestEnvelope

export type HandlerProps = HandlerInput

export type HandlerResponse = Response

export type HandlerActionFn = (props: HandlerInput) => Promise<HandlerResponse>

export interface Handler {
	customRequestHandlers: RequestHandler[]
	onLaunch: HandlerActionFn
	onHelp: HandlerActionFn
	onCancelAndStop: HandlerActionFn
	onFallback: HandlerActionFn
	onSessionEnded: HandlerActionFn
	onIntentReflector: HandlerActionFn
	onNo: HandlerActionFn
	onError: (props: HandlerInput, error: Error) => Promise<HandlerResponse>
}
