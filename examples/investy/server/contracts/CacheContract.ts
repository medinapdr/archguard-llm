export type ConstructorOptions = {
	/**
	 * Standard time to live in seconds.
	 */
	defaultExpirationInSeconds?: number
}

export abstract class CacheContract<Entity extends unknown> {
	public abstract get (key: string): Promise<Entity>
	public abstract set (key: string, data: Entity, expirationInSeconds?: number): Promise<boolean>

	public async cachefy (key: string, getFreshData: () => Promise<Entity>): Promise<Entity> {
		let cachedData = await this.get(key)

		const isInvalidCache = cachedData === undefined || cachedData === null

		if (isInvalidCache) {
			cachedData = await getFreshData()

			await this.set(key, cachedData)
		}

		return cachedData
	}
}
