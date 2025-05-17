import { SpoilerInfo } from "@/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol"

import OpexService from "@/Skills/OnePieceMangaSpoiler/Services/OpexService"
import HttpService from "@/Services/HttpService"

class OpexModule {
	async getSpoilerInfo (): Promise<SpoilerInfo> {
		const OPEX_WEBSITE_BASE_URL = "https://onepieceex.net"

		const httpService = new HttpService({ baseURL: OPEX_WEBSITE_BASE_URL })
		const landingPageHTML = await httpService.toString("")

		if (!landingPageHTML) {
			return {
				status: "not-found"
			}
		}

		const spoilerPageUrl = OpexService.getSpoilerPageUrlByLandingPageHTML(landingPageHTML)

		if (!spoilerPageUrl) {
			return {
				status: "not-found"
			}
		}

		const spoilerPagePath = spoilerPageUrl.replace(OPEX_WEBSITE_BASE_URL, "")
		const spoilerPageHTML = await httpService.toString(spoilerPagePath)
		const spoilerInfo = OpexService.getSpoilerInfoBySpoilerPageHTML(spoilerPageHTML)

		return spoilerInfo
	}
}

export default new OpexModule()
