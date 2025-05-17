class StatusInvestUtil {
	splitComposedCode (composedCode: string): string[] {
		return composedCode.split(/[ -]/)
	}
}

export default new StatusInvestUtil()
