class Object {
    merge (firstObject: object, secondObject: object): object {
        return {
            ...firstObject,
            ...secondObject
        }
    }
}

export default new Object()