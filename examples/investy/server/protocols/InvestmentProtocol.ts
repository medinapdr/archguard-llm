export type Asset = {
	code: string
	name: string
	priceInCents: number
}

export interface InvestmentHandler {
	getAsset: (code: string) => Promise<Asset | null>
}
