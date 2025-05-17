import StringSimilarity from "string-similarity"

class StringUtil {
	areSimilar (firstString: string, secondString: string): boolean {
		const normalizedFirstString = firstString.toLowerCase()
		const normalizedSecondString = secondString.toLowerCase()

		const similarity = StringSimilarity.compareTwoStrings(normalizedFirstString, normalizedSecondString)

		return similarity > 0.8
	}

	getMostSimilarIndex (firstString: string, comparisonStringList: string[]): number {
		const normalizedFirstString = firstString.toLowerCase()
		const normalizedComparisonStringList = comparisonStringList.map(string => string.toLowerCase())

		const result = StringSimilarity.findBestMatch(normalizedFirstString, normalizedComparisonStringList)

		return result.bestMatchIndex
	}
}

export default new StringUtil()
