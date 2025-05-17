import axios from "axios"

import { Asset, InvestmentHandler } from "@server/protocols/InvestmentProtocol"
import { RawAsset } from "@server/protocols/StatusInvestProtocol"

import StringUtil from "@server/utils/StringUtil"
import StatusInvestUtil from "@server/utils/StatusInvestUtil"

class StatusInvestLib implements InvestmentHandler {
	private readonly client = axios.create({
		baseURL: "https://statusinvest.com.br",
		withCredentials: true,
		headers: {
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36"
		}
	})

	async getAsset (code: string): Promise<Asset | null> {
		const splittedComposedCode = StatusInvestUtil.splitComposedCode(code)

		const isComposedCode = splittedComposedCode.length > 1

		if (isComposedCode) {
			return await this.getAssetByComposedCode(code)
		} else {
			return await this.getAssetByNormalCode(code)
		}
	}

	private async searchAssets (code: string): Promise<Asset[]> {
		const response = await this.client.get<RawAsset[]>("/home/mainsearchquery", {
			params: {
				q: code
			}
		})

		const assets: Asset[] = response.data.map(rawAsset => {
			const priceInCents = Number(rawAsset.price.replace(/\D/g, ""))
	
			return {
				code: rawAsset.code,
				name: rawAsset.name,
				priceInCents
			}
		})

		return assets
	}

	private async getAssetByNormalCode (code: string): Promise<Asset | null> {
		const assets = await this.searchAssets(code)

		const [asset] = assets
	
		if (!asset) {
			return null
		}

		return asset
	}

	/**
	 * In case the asset code is composed (Per example: 'Trend Pós-Fixado FIC FI RF Simples'),
	 * the status invest search api performs better by querying parts of the code name.
	 */
	private async getAssetByComposedCode (code: string): Promise<Asset | null> {
		const assetCodeParts = StatusInvestUtil.splitComposedCode(code)

		let assetSearchString = ""

		for (const assetCodePart of assetCodeParts) {
			assetSearchString += ` ${assetCodePart}`
			assetSearchString = assetSearchString.trim()

			const assets = await this.searchAssets(assetSearchString)

			if (!assets.length) {
				continue
			}

			const assetNames = assets.map(asset => asset.name)
			const mostSimilarAssetIndex = StringUtil.getMostSimilarIndex(code, assetNames)

			const asset = assets[mostSimilarAssetIndex]

			if (!asset) {
				continue
			}

			const isExpectedAsset = StringUtil.areSimilar(code, asset.name)

			if (isExpectedAsset) {
				return asset
			}
		}

		return null
	}
}

export default new StatusInvestLib()
