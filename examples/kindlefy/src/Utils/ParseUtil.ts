import ErrorHandlerService from "@/Services/ErrorHandlerService"

import { ArrayParsingException } from "@/Exceptions/ArrayParsingException"

class ParseUtil {
	safelyParseArray<Data extends unknown>(value: string): Data[] {
		try {
			return JSON.parse(value)
		} catch (error) {
			ErrorHandlerService.handle(new ArrayParsingException(value, error))
			return []
		}
	}
}

export default new ParseUtil()
