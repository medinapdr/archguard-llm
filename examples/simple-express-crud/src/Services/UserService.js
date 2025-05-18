const UserRepository = require("../Repositories/UserRepository")

class UserService {
	getAll () {
		return UserRepository.getAll()
	}

	retrieveOne (id) {
		return UserRepository.getById(id)
	}

	create (user) {
		return UserRepository.create(user)
	}
}

module.exports = new UserService()
