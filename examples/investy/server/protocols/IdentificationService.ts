class IdentificationService {
    generateIntID (): number {
        return Date.now()
    }
}

export default new IdentificationService()