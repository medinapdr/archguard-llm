class AccountRepository {
	static #accounts = []

	retrieveAll () {
		return AccountRepository.#accounts
	}

	add (user) {
		AccountRepository.#accounts.push({
			...user,
			id: Date.now().toString()
		})
	}
}

module.exports = new AccountRepository()
