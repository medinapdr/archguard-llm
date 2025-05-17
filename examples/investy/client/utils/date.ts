export const formatHumanDate = (date: string | Date) => {
	const options: Intl.DateTimeFormatOptions = {
		dateStyle: "long",
		timeStyle: "medium"
	}

	const formatter = new Intl.DateTimeFormat("default", options)

	const formattedDate = formatter.format(new Date(date))

	return formattedDate
}
