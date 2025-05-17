import React, { ReactElement, cloneElement } from "react"

import { mergeClassNames } from "@client/utils/style"

export type DefaultElementProps = Record<string, unknown> & React.HTMLAttributes<ReactElement>

export const cloneElementSafely = (child: ReactElement, props?: DefaultElementProps) => {
	const { className, ...rest } = (props || {}) as DefaultElementProps

	return (
		cloneElement(child, {
			...child?.props,
			...rest,
			className: mergeClassNames([
				child?.props?.className,
				props?.className
			])
		})
	)
}
