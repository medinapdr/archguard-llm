import { Asset, InvestmentHandler } from "@server/protocols/InvestmentProtocol"

import StatusInvestLib from "@server/lib/StatusInvestLib"

class InvestmentService implements InvestmentHandler {
	async getAsset (code: string): Promise<Asset | null> {
		return await StatusInvestLib.getAsset(code)
	}
}

export default new InvestmentService()
