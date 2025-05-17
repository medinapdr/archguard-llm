class UserRepository {
	static #users = []

	getAll () {
		return UserRepository.#users
	}

	getOne (id) {
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
