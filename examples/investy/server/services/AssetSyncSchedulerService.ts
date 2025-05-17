class AssetSyncSchedulerService {
	async scheduleNotionAssetSync (assetSyncId: string, force: boolean = false): Promise<void> {
		/**
		 * WARNING:
		 * - Use lazy import to avoid dependecy cycle, since this queue
		 * calls itself after running.
		 * - TODO: Using an Event Driven Architecture would help to avoid
		 * this dependendy cycle while adding useful features for this app.
		 */
		const queueModule = await import("@server/infra/queue")

		await queueModule.default.enqueue({
			name: "SyncNotionAssetPrice",
			payload: {
				assetSyncId
			},
			options: {
				id: assetSyncId,
				...(!force && {
					scheduleTimeInMilliseconds: 1000 * 60 * (10) // 10 minutes
				})
			}
		})
	}
}

export default new AssetSyncSchedulerService()
