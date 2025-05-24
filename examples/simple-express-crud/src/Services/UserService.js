const UserRepository = require("../Repositories/UserRepository")

class UserService {
	getAll () {
		return UserRepository.getAll()
	}

	getById (id) {
		return UserRepository.getById(id)
	}

	create (user) {
		return UserRepository.create(user)
	}

	updateById (id, data) {
		return UserRepository.updateById(id, data)
	}
}

module.exports = new UserService()
