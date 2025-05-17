import MongooseRepositoryAdapter from "@server/adapters/MongooseRepositoryAdapter"

import UserEntity from "@server/entities/UserEntity"

import UserSchema from "@server/schemas/UserSchema"

class UserRepository extends MongooseRepositoryAdapter<UserEntity> {}

export default new UserRepository(UserSchema)
