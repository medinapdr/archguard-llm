import AuthConfig from "@server/config/AuthConfig"

import { AuthTokenPayload } from "@server/protocols/AuthProtocol"

import HashService from "@server/services/HashService"
import CryptService from "@server/services/CryptService"

class AuthService {
	private readonly hashService = new HashService(AuthConfig.hashSaltRounds)
	private readonly cryptService = new CryptService(AuthConfig.tokenSecret)

	async makeHashedPassword (password: string): Promise<string> {
		return await this.hashService.makeHash(password)
	}

	async isValidPassword (password: string, hashedPassword: string): Promise<boolean> {
		return await this.hashService.isHashValid(password, hashedPassword)
	}

	async decodeAuthToken (authToken: string): Promise<AuthTokenPayload | null> {
		const authTokenPayload = this.cryptService.decode<AuthTokenPayload>(authToken)

		if (!authTokenPayload) {
			return null
		}

		return authTokenPayload
	}

	async generateAuthToken (userId: string): Promise<string> {
		const authToken = this.cryptService.encode<AuthTokenPayload>({
			userId
		}, {
			expiresIn: AuthConfig.tokenExpirationInSeconds
		})

		return authToken
	}
}

export default new AuthService()
