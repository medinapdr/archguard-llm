import { AwsAlexaEventToken } from "@serverless/typescript"

export type FnConfig = {
	[k: string]: {
		handler?: string
		events?: Array<{
			alexaSkill: AwsAlexaEventToken
		}>
	}
}

export type CustomSkillConfig = {
	id: string
	manifest: {
		apis: {
			custom: {
				endpoint?: {
					uri: string
				}
			}
		}
		manifestVersion: string
	}
}

export type CustomConfig = {
	alexa: {
		skills: CustomSkillConfig[]
	}
}
