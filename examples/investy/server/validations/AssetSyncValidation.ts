import AssetSyncRepository from "@server/repositories/AssetSyncRepository"

class AssetSyncValidation {
	async belongsToUser (assetSyncId: string, userId: string): Promise<boolean> {
		const assetSync = await AssetSyncRepository.retrieveOne({
			user_id: userId,
			id: assetSyncId
		})

		return Boolean(assetSync)
	}
}

export default new AssetSyncValidation()
