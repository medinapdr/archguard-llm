class UserRepository {
	static #users = []

	getAll () {
		return UserRepository.#users
	}

	retrieveOne (id) {
		return UserRepository.#users[id]
	}

	create (user) {
		UserRepository.#users.push({
			...user,
			id: Date.now().toString()
		})
	}
}

module.exports = new UserRepository()
