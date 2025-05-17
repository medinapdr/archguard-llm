const UserRepository = require("../Repositories/UserRepository")

class UserService {
	getAll () {
		return UserRepository.getAll()
	}

	create (user) {
		return UserRepository.create(user)
	}
}

module.exports = new UserService()
