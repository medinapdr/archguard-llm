import MongooseRepositoryAdapter from "@server/adapters/MongooseRepositoryAdapter"

import IntegrationEntity from "@server/entities/IntegrationEntity"

import IntegrationSchema from "@server/schemas/IntegrationSchema"

class IntegrationRepository extends MongooseRepositoryAdapter<IntegrationEntity> {}

export default new IntegrationRepository(IntegrationSchema)
