import AssetSyncEntity from "@server/entities/AssetSyncEntity"
import IntegrationEntity from "@server/entities/IntegrationEntity"

import { DefaultEntity } from "@server/contracts/RepositoryContract"

interface UserEntity extends DefaultEntity {
	name: string
	email: string
	password: string
	picture_url?: string
	integrations?: IntegrationEntity[]
	asset_syncs?: AssetSyncEntity[]
}

export default UserEntity
