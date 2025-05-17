class HandlerUtil {
	buildHandlerPath (name: string): string {
		return `src/Skills/${name}/index.main`
	}
}

export default new HandlerUtil()
