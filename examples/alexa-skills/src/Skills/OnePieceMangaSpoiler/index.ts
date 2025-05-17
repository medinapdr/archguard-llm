import { HandlerProps, HandlerResponse } from "@/Protocols/HandlerProtocol"

import HandlerAdapterModule from "@/Modules/HandlerAdapterModule"
import HandlerModule from "@/Modules/HandlerModule"
import OpexModule from "@/Skills/OnePieceMangaSpoiler/Modules/OpexModule"

import DateUtil from "@/Skills/OnePieceMangaSpoiler/Utils/DateUtil"

class OnePieceMangaSpoilerHandler extends HandlerModule {
	customRequestHandlers: HandlerModule["customRequestHandlers"] = [
		{
			canHandle: HandlerAdapterModule.canHandleCustomIntent("OnePieceMangaSpoilerIntent"),
			handle: async (props) => await this.onOnePieceMangaSpoilerIntent(props)
		}
	]

	async onLaunch ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		const spoilerInfo = await OpexModule.getSpoilerInfo()
		
		const today = DateUtil.getTodayDate()
		const isSpoilerFromCurrentWeek = Boolean(spoilerInfo.date) && DateUtil.isSameWeek(today, spoilerInfo.date)
		const wasSpoilerNotFound = spoilerInfo.status === "not-found"
		const foundNoSpoilerForCurrentWeek = !isSpoilerFromCurrentWeek || wasSpoilerNotFound

		if (foundNoSpoilerForCurrentWeek) {
			const speakOutput = "Nenhum spoiler foi encontrado nessa semana"
			return responseBuilder.speak(speakOutput).getResponse()
		}

		if (spoilerInfo.status === "available") {
			const speakOutput = "Temos spoiler essa semana! Quer que eu te conte?"
			return responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse()
		}
		
		if (spoilerInfo.status === "manga-launched") {
			const speakOutput = "O mangá dessa semana já foi lançado! Quer que eu te conte o spoiler mesmo assim?"
			return responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse()
		}
	}

	async onOnePieceMangaSpoilerIntent ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		const spoilerInfo = await OpexModule.getSpoilerInfo()
		
		return responseBuilder.speak(spoilerInfo.content).getResponse()
	}

	async onNo ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		const speakOutput = "Entendido, tenha uma ótima semana!"

		return responseBuilder.speak(speakOutput).getResponse()
	}

	async onHelp ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		const speakOutput = "Me pergunte se tenho notícia do chapéu de palha para saber mais sobre os spoilers do mangá de One Piece dessa semana."
		
		return responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse()
	}

	async onCancelAndStop ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		const speakOutput = "Obrigada por usar essa skill. Para ativá-la novamente, basta perguntar: 'Alexa, tem notícia do chapéu de palha?'"

		return responseBuilder.speak(speakOutput).getResponse()
	}
}

export const main = HandlerAdapterModule.adapt(new OnePieceMangaSpoilerHandler())
