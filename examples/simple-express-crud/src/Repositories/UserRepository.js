class UserRepository {
	static #users = []

	getAll () {
		return UserRepository.#users
	}

	create (user) {
		UserRepository.#users.push({
			...user,
			id: Date.now().toString()
		})
	}
}

module.exports = new UserRepository()
