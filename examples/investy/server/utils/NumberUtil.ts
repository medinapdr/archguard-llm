class NumberUtil {
	toDecimal (num: number): number {
		return Number((num / 100).toFixed(2))
 	}
}

export default new NumberUtil()
