import { PartialMap } from "@server/protocols/UtilityProtocol"

export type Validation = {
	isValid: (fieldValue: string) => boolean | Promise<boolean>
	errorCode: string
}

export type ValidationResult<Data> = {
	valid: boolean
	fieldErrors: PartialMap<keyof Data, string>
	data: Data
}

export type DefaultValidation = "wasSupplied"
