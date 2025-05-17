import UserEntity from "@server/entities/UserEntity"

import { DefaultEntity } from "@server/contracts/RepositoryContract"

export type IntegrationType = "notion"

interface IntegrationEntity extends DefaultEntity {
	user_id: string
	type: IntegrationType
	token: string
	user?: UserEntity
}

export default IntegrationEntity
