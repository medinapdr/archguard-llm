class InMemoryDatabaseService<Model extends { id: string }> {
    private data: Model[] = []

    async create (model: Model): Promise<void> {
        this.data.push(model)
    }

    async retrieve (id: string): Promise<Model | null> {
        const foundData = this.data.find(model => model.id === id)

        if (!foundData) {
            return null
        }

        return foundData
    }
}

export default InMemoryDatabaseService
