import AssetSyncRepository from "@server/repositories/AssetSyncRepository"

import UserRepository from "@server/repositories/UserRepository"

class AssetSyncValidation {
	async belongsToUser (assetSyncId: string, userId: string): Promise<boolean> {
		const assetSync = await AssetSyncRepository.retrieveOne({
			user_id: userId,
			id: assetSyncId
		})

		return Boolean(assetSync)
	}

	async deleteUserById (userId: string): Promise<void> {
		await UserRepository.delete({ id: userId })
	}
}

export default new AssetSyncValidation()
