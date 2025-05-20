class AccountRepository {
	static #accounts = []

	getAll () {
		return AccountRepository.#accounts
	}

	retrieveOneById (id) {
		return AccountRepository.#accounts[id]
	}

	create (account) {
		AccountRepository.#accounts.push({
			...account,
			id: Date.now().toString()
		})
	}
}

module.exports = new AccountRepository()
