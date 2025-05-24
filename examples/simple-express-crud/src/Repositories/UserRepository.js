class UserRepository {
	static #users = []

	getAll () {
		return UserRepository.#users
	}

	getById (id) {
		return UserRepository.#users[id]
	}

	create (user) {
		UserRepository.#users.push({
			...user,
			id: Date.now().toString()
		})
	}

	updateById (id, data) {
		return UserRepository.#users[id] = {
			...UserRepository.#users[id],
			...data
		}
	}
}

module.exports = new UserRepository()
