class AccountRepository {
	static #accounts = []

	retrieveAll () {
		return AccountRepository.#accounts
	}

	addOneAccount (account) {
		AccountRepository.#accounts.push({
			...account,
			id: Date.now().toString()
		})
	}
}

module.exports = new AccountRepository()
