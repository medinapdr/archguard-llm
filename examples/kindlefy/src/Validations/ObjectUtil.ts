class ObjectUtil {
    merge (firstObject, secondObject) {
        return {
            ...firstObject,
            ...secondObject
        }
    }    
}

export default new ObjectUtil()
