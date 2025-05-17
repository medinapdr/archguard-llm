class SanitizationUtil {
	sanitizeSpoilerContent (spoilerContent: string): string {
		let sanitizedSpoilerContent = spoilerContent.replace(/(– )/, "").replace(/(\s*)/, "")

		const hasDotAsLastCharacter = sanitizedSpoilerContent[sanitizedSpoilerContent.length - 1] === "."

		if (hasDotAsLastCharacter) {
			sanitizedSpoilerContent = sanitizedSpoilerContent.slice(0, -1)
		}

		return sanitizedSpoilerContent
	}
}

export default new SanitizationUtil()
