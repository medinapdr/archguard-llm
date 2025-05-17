import NodeCache from "node-cache"

import { CacheContract, ConstructorOptions } from "@server/contracts/CacheContract"

class NodeCacheAdapter<Entity> extends CacheContract<Entity> {
	private readonly cache: NodeCache

	constructor (options: ConstructorOptions) {
		super()

		this.cache = new NodeCache({
			stdTTL: options.defaultExpirationInSeconds,
			checkperiod: options.defaultExpirationInSeconds
		})
	}

	/**
	 * https://www.npmjs.com/package/node-cache
	 * As shown by docs, if cache doesn't exist it will return explicit undefined
	 */
	async get (key: string): Promise<Entity> {
		return await Promise.resolve(this.cache.get(key))
	}

	async set (key: string, data: Entity, expirationInSeconds?: number): Promise<boolean> {
		return await Promise.resolve(this.cache.set(key, data, expirationInSeconds))
	}
}

export default NodeCacheAdapter
