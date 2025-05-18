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

	addMany (userList) {
		UserRepository.#users.push(userList.map(user => ({
			...user,
			id: Date.now().toString()
		})))
	}
}

module.exports = new UserRepository()
