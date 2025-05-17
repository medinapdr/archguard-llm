import { Database } from "@client/protocols/notion"

import { ApiHandlerInput } from "@server/contracts/HttpContract"

import NotionLib from "@server/lib/NotionLib"

import IntegrationService from "@server/services/IntegrationService"
import AssetSyncSchedulerService from "@server/services/AssetSyncSchedulerService"
import InMemoryCacheService from "@server/services/InMemoryCacheService"

import AssetSyncRepository from "@server/repositories/AssetSyncRepository"

import { AssetSyncExtraData } from "@server/entities/AssetSyncEntity"

import NotionAssetSyncValidation, { NotionBody } from "@server/validations/NotionAssetSyncValidation"
import AssetSyncValidation from "@server/validations/AssetSyncValidation"

type ResourceParams = {
	id: string
}

const notionDatabaseCache = new InMemoryCacheService<Database>({ defaultExpirationInSeconds: 60 })

class NotionAssetSyncController {
	async create ({ request, response, context }: ApiHandlerInput<{}, NotionBody, {}>): Promise<void> {
		const userId = context.auth.userId
	
		const validation = await NotionAssetSyncValidation.validateNotionData(request.body)

		if (!validation.valid) {
			return response.badRequest(validation.fieldErrors)
		}

		const { databaseId, assetCodePropertyId, assetPricePropertyId } = validation.data

		const notionIntegration = await IntegrationService.getNotionIntegration(userId)

		if (!notionIntegration) {
			return response.notFound("NotionIntegrationNotFound")
		}

		const notionAssetSync = await AssetSyncRepository.create({
			user_id: userId,
			integration_id: notionIntegration.id,
			extra_data: {
				notion: {
					database_id: databaseId,
					asset_code_property_id: assetCodePropertyId,
					asset_price_property_id: assetPricePropertyId
				}
			}
		})
		
		await AssetSyncSchedulerService.scheduleNotionAssetSync(notionAssetSync.id)

		return response.noContent()
	}

	async update ({ request, response, context }: ApiHandlerInput<{}, NotionBody, ResourceParams>): Promise<void> {
		const assetSyncId = request.params.id
		const userId = context.auth.userId

		const assetSyncBelongsToUser = await AssetSyncValidation.belongsToUser(assetSyncId, userId)

		if (!assetSyncBelongsToUser) {
			return response.forbidden()
		}

		const validation = await NotionAssetSyncValidation.validateNotionData(request.body)

		if (!validation.valid) {
			return response.badRequest(validation.fieldErrors)
		}

		const { databaseId, assetCodePropertyId, assetPricePropertyId } = validation.data

		const notionAssetSync = await AssetSyncRepository.retrieveOneById(assetSyncId)
		
		if (!notionAssetSync) {
			return response.notFound()
		}

		const currentNotionData = notionAssetSync.extra_data.notion

		const updatedExtraData: AssetSyncExtraData = {
			notion: {
				database_id: databaseId ?? currentNotionData.database_id,
				asset_code_property_id: assetCodePropertyId ?? currentNotionData.asset_code_property_id,
				asset_price_property_id: assetPricePropertyId ?? currentNotionData.asset_price_property_id
			}
		}

		await AssetSyncRepository.updateOneById(assetSyncId, { extra_data: updatedExtraData })

		await AssetSyncSchedulerService.scheduleNotionAssetSync(assetSyncId)

		return response.noContent()
	}

	async retrieveAll ({ response, context }: ApiHandlerInput): Promise<void> {
		const userId = context.auth.userId

		const notionIntegration = await IntegrationService.getNotionIntegration(userId)

		if (!notionIntegration) {
			return response.notFound("NotionIntegrationNotFound")
		}

		const notionAssetSyncs = await AssetSyncRepository.retrieveAll({
			user_id: userId,
			integration_id: notionIntegration.id
		})

		const notion = new NotionLib(notionIntegration.token)

		const formattedAssetSyncs = await Promise.all(
			notionAssetSyncs.map(async notionAssetSync => {
				const database = await notionDatabaseCache.cachefy(notionAssetSync.id, async () => (
					await notion.getDatabase(notionAssetSync.extra_data.notion.database_id)
				))

				const assetCodeColumn = database?.columns.find(({ id }) => id === notionAssetSync.extra_data.notion.asset_code_property_id)
				const assetPriceColumn = database?.columns.find(({ id }) => id === notionAssetSync.extra_data.notion.asset_price_property_id)

				return {
					id: notionAssetSync.id,
					lastSyncAt: notionAssetSync.last_sync_at,
					lastSyncStatus: notionAssetSync.last_sync_status,
					lastSyncError: notionAssetSync.last_sync_error,
					notion: {
						database: database ? {
							id: database.id,
							url: database.url,
							name: database.title,
							cover: database.cover,
							icon: database.icon
						} : {},
						assetCode: assetCodeColumn ? {
							id: assetCodeColumn.id,
							name: assetCodeColumn.name,
							type: assetCodeColumn.type
						} : {},
						assetPrice: assetPriceColumn ? {
							id: assetPriceColumn.id,
							name: assetPriceColumn.name,
							type: assetPriceColumn.type
						} : {}
					}
				}
			})
		)

		return response.ok(formattedAssetSyncs)
	}

	async forceSync ({ request, response, context }: ApiHandlerInput<{}, {}, ResourceParams>): Promise<void> {
		const assetSyncId = request.params.id
		const userId = context.auth.userId

		const assetSyncBelongsToUser = await AssetSyncValidation.belongsToUser(assetSyncId, userId)

		if (!assetSyncBelongsToUser) {
			return response.forbidden()
		}

		await AssetSyncSchedulerService.scheduleNotionAssetSync(assetSyncId, true)

		return response.noContent()
	}
}

export default new NotionAssetSyncController()
