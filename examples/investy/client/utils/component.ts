import { Children, FC, ReactNode } from "react"

export const attachSubComponents = <MainComponent, SubComponents extends Record<string, FC>>(mainComponent: MainComponent, subComponents: SubComponents) => {
	return Object.assign(mainComponent, subComponents)
}

export const hasDisplayName = (component: ReactNode, displayName: string) => {
	// eslint-disable-next-line
	return (component as any)?.type?.displayName === displayName
}

export const containsComponentWithDisplayName = (component: ReactNode, displayName: string) => {
	const componentHasDisplayName = hasDisplayName(component, displayName)

	if (componentHasDisplayName) {
		return true
	}

	// eslint-disable-next-line
	const children = (component as any)?.props?.children as ReactNode

	const childrenCount = Children.count(children)
	const isThereAnyChild = childrenCount > 0

	if (isThereAnyChild) {
		return Children.toArray(children).some(child => containsComponentWithDisplayName(child, displayName))
	} else {
		return false
	}
}
