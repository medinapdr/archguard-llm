import { Handler, HandlerProps, HandlerResponse } from "@/Protocols/HandlerProtocol"

abstract class HandlerModule implements Handler {
	customRequestHandlers: Handler["customRequestHandlers"] = []

	async onLaunch ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		return responseBuilder.getResponse()
	}

	async onNo ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		return responseBuilder.getResponse()
	}

	async onHelp ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		return responseBuilder.getResponse()
	}

	async onCancelAndStop ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		return responseBuilder.getResponse()
	}

	async onFallback ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		return responseBuilder.getResponse()
	}

	async onSessionEnded ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		return responseBuilder.getResponse()
	}

	async onIntentReflector ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		return responseBuilder.getResponse()
	}

	async onError ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		return responseBuilder.getResponse()
	}
}

export default HandlerModule
