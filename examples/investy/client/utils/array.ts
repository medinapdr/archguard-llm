export const isLastItem = (index: number, totalItems?: number) => {
	return (index + 1) === totalItems
}

export const isFirstItem = (index: number) => {
	return (index === 0)
}
