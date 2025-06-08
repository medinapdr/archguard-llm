class ArrayUtil {
    merge (array1: unknown[], array2: unknown[]): unknown[] {
        return [
            ...array1,
            ...array2
        ]
    }
}

export default new ArrayUtil()