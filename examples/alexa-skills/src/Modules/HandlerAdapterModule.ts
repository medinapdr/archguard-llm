import * as Alexa from "ask-sdk-core"
import { LambdaHandler, RequestHandler, ErrorHandler } from "ask-sdk-core"

import { Handler } from "@/Protocols/HandlerProtocol"

class HandlerAdapterModule {
	adapt (handler: Handler): LambdaHandler {
		const alexaHandler = Alexa.SkillBuilders.custom()

		alexaHandler.addRequestHandlers(...handler.customRequestHandlers)

		const adaptedRequestHandlers = this.adaptRequestHandlers(handler)
		alexaHandler.addRequestHandlers(...adaptedRequestHandlers)

		const adaptedErrorHandlers = this.adaptErrorHandlers(handler)
		alexaHandler.addErrorHandlers(...adaptedErrorHandlers)

		alexaHandler.withCustomUserAgent("guilhermebkel/alexa-skills")

		return alexaHandler.lambda()
	}

	canHandleCustomIntent (customIntentName: string): RequestHandler["canHandle"] {
		return (props) => (
			Alexa.getRequestType(props.requestEnvelope) === "IntentRequest" &&
			Alexa.getIntentName(props.requestEnvelope) === customIntentName
		)
	}

	private adaptRequestHandlers (handler: Handler): RequestHandler[] {
		return [
			{
				canHandle: (props) => (
					Alexa.getRequestType(props.requestEnvelope) === "LaunchRequest"
				),
				handle: async (props) => await handler.onLaunch(props)
			},
			{
				canHandle: (props) => (
					Alexa.getRequestType(props.requestEnvelope) === "IntentRequest" &&
          Alexa.getIntentName(props.requestEnvelope) === "AMAZON.NoIntent"
				),
				handle: async (props) => await handler.onNo(props)
			},
			{
				canHandle: (props) => (
					Alexa.getRequestType(props.requestEnvelope) === "IntentRequest" &&
          Alexa.getIntentName(props.requestEnvelope) === "AMAZON.HelpIntent"
				),
				handle: async (props) => await handler.onHelp(props)
			},
			{
				canHandle: (props) => (
					Alexa.getRequestType(props.requestEnvelope) === "IntentRequest" &&
					["AMAZON.CancelIntent", "AMAZON.StopIntent"].includes(Alexa.getIntentName(props.requestEnvelope))
				),
				handle: async (props) => await handler.onCancelAndStop(props)
			},
			{
				canHandle: (props) => (
					Alexa.getRequestType(props.requestEnvelope) === "IntentRequest" &&
					Alexa.getIntentName(props.requestEnvelope) === "AMAZON.FallbackIntent"
				),
				handle: async (props) => await handler.onFallback(props)
			},
			{
				canHandle: (props) => (
					Alexa.getRequestType(props.requestEnvelope) === "SessionEndedRequest"
				),
				handle: async (props) => await handler.onSessionEnded(props)
			},
			{
				canHandle: (props) => (
					Alexa.getRequestType(props.requestEnvelope) === "IntentRequest"
				),
				handle: async (props) => await handler.onIntentReflector(props)
			}
		]
	}

	private adaptErrorHandlers (handler: Handler): ErrorHandler[] {
		return [
			{
				canHandle: () => true,
				handle: async (props, error) => await handler.onError(props, error)
			}
		]
	}
}

export default new HandlerAdapterModule()
