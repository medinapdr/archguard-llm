import { Children, FC, ReactChild, ReactNode, useMemo } from "react"

import { containsComponentWithDisplayName } from "@client/utils/component"

export const buildSubComponents = <SubComponents extends Record<string, FC>>(subComponents: SubComponents) => {
	return subComponents
}

export const attachSubComponents = <MainComponent, SubComponents extends Record<string, FC>>(mainComponent: MainComponent, subComponents: SubComponents) => {
	return Object.assign(mainComponent, subComponents)
}

const useSubComponents = <SubComponents extends Record<string, FC>>(children: ReactNode, subComponents: SubComponents) => {
	return useMemo(() => {
		const parsedChildren = {} as Record<string, ReactChild[]>

		Object.entries(subComponents).forEach(([subComponentName, subComponentFC]) => {
			parsedChildren[subComponentName] = Children.toArray(children).filter(child => containsComponentWithDisplayName(child, subComponentFC.displayName)) as ReactChild[]
		})

		return parsedChildren as Record<keyof SubComponents, ReactChild[]>
	// eslint-disable-next-line
	}, [children])
}

export default useSubComponents
