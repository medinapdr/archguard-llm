import { QueueHandler, QueueName, QueuePayload } from "@server/contracts/QueueContract"

import AssetSyncRepository from "@server/repositories/AssetSyncRepository"
import IntegrationRepository from "@server/repositories/IntegrationRepository"

import AssetSyncSchedulerService from "@server/services/AssetSyncSchedulerService"

import NotionLib from "@server/lib/NotionLib"
import StatusInvestLib from "@server/lib/StatusInvestLib"

import NumberUtil from "@server/utils/NumberUtil"
import ErrorSerializationUtil from "@server/utils/ErrorSerializationUtil"

import QueueProcessException from "@server/exceptions/QueueProcessException"

class SyncNotionAssetPriceQueue implements QueueHandler {
	name: QueueName = "SyncNotionAssetPrice"

	async handle (payload: QueuePayload["SyncNotionAssetPrice"]): Promise<void> {
		const { assetSyncId } = payload

		const assetSync = await AssetSyncRepository.retrieveOneById(assetSyncId)

		if (!assetSync) {
			throw new QueueProcessException("AssetSyncNotFound")
		}

		const integration = await IntegrationRepository.retrieveOne({
			id: assetSync.integration_id,
			type: "notion"
		})

		if (!integration) {
			throw new QueueProcessException("NotionIntegrationNotFound")
		}

		const notionData = assetSync.extra_data.notion

		const notion = new NotionLib(integration.token)

		const databaseRows = await notion.getDatabaseRows(notionData.database_id)

		const assetPriceColumnType = databaseRows[0]?.columns?.find(({ id }) => id === notionData.asset_price_property_id)?.type

		if (assetPriceColumnType !== "number") {
			throw new QueueProcessException("InvalidAssetPriceColumnType")
		}

		await Promise.all(
			databaseRows.map(async row => {
				const assetCodeColumn = row.columns.find(({ id }) => id === notionData.asset_code_property_id)
				const assetCode = assetCodeColumn.value

				const assetInfo = await StatusInvestLib.getAsset(assetCode)
				const formattedAssetPrice = NumberUtil.toDecimal(assetInfo.priceInCents)

				await notion.updateDatabaseRow(notionData.asset_price_property_id, row.id, formattedAssetPrice)
			})
		)
	}

	async onActive (payload: QueuePayload["SyncNotionAssetPrice"]): Promise<void> {
		const { assetSyncId } = payload

		await AssetSyncRepository.updateOneById(assetSyncId, {
			last_sync_at: new Date(),
			last_sync_status: "processing"
		})
	}

	async onCompleted (payload: QueuePayload["SyncNotionAssetPrice"]): Promise<void> {
		const { assetSyncId } = payload

		await AssetSyncRepository.updateOneById(assetSyncId, {
			last_sync_status: "success"
		})

		await AssetSyncSchedulerService.scheduleNotionAssetSync(assetSyncId)
	}

	async onError (payload: QueuePayload["SyncNotionAssetPrice"], error: Error): Promise<void> {
		const { assetSyncId } = payload

		await AssetSyncRepository.updateOneById(assetSyncId, {
			last_sync_status: "error",
			last_sync_error: ErrorSerializationUtil.serialize(error)
		})

		await AssetSyncSchedulerService.scheduleNotionAssetSync(assetSyncId)
	}
}

export default new SyncNotionAssetPriceQueue()
