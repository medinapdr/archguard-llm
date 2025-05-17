export const mergeClassNames = (classNames: string[]) => {
	return classNames.filter(Boolean).join(" ")
}

export const conditionalClassNames = (active: boolean, classNames: string[]) => {
	if (active) {
		return mergeClassNames(classNames)
	} else {
		return ""
	}
}

export const defaultTransitionClassName = "transition duration-150 ease-in-out"

export const defaultShadowClassName = "shadow-sm"
