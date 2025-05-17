class UserRepository {
	static #users = []

	getAll () {
		return UserRepository.#users
	}

	getById (id) {
		return UserRepository.#users.find(user => user.id === id);
	}

	create (user) {
		UserRepository.#users.push({
			...user,
			id: Date.now().toString()
		})
	}
}

module.exports = new UserRepository()
