import MongooseRepositoryAdapter from "@server/adapters/MongooseRepositoryAdapter"

import AssetSyncEntity from "@server/entities/AssetSyncEntity"

import AssetSyncSchema from "@server/schemas/AssetSyncSchema"

class AssetSyncRepository extends MongooseRepositoryAdapter<AssetSyncEntity> {}

export default new AssetSyncRepository(AssetSyncSchema)
