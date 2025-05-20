class AccountRepository {
	static #accounts = []

	getAll () {
		return AccountRepository.#accounts
	}

	getById (id) {
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
