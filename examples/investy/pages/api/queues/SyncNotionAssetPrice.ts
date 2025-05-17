import QuirrelQueueAdapter from "@server/adapters/QuirrelQueueAdapter"

import SyncNotionAssetPriceQueue from "@server/queues/SyncNotionAssetPriceQueue"

export default QuirrelQueueAdapter.adaptQueueHandler(SyncNotionAssetPriceQueue)
