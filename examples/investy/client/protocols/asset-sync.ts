export type NotionAssetSync = {
	id: string
	lastSyncAt: string
	lastSyncStatus: "success" | "error" | "processing"
	lastSyncError?: Record<string, unknown>
	notion?: {
		database?: {
			id: string
			url: string
			name: string
			cover: string
			icon: string
		}
		assetCode?: {
			id: string
			name: string
			type: string
		}
		assetPrice?: {
			id: string
			name: string
			type: string
		}
	}
}
