class AccountRepository {
	static #accounts = []

	getAll () {
		return AccountRepository.#accounts
	}

	create (account) {
		AccountRepository.#accounts.push({
			...account,
			id: Date.now().toString()
		})
	}
}

module.exports = new AccountRepository()
