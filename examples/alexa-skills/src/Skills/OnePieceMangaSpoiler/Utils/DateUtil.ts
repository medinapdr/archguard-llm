class DateUtil {
	/**
	 *
	 * @param BRHumanDate A date in the format: "DIA" de "MÊS" de "ANO"
	 */
	turnBRHumanDateIntoDate (BRHumanDate: string): Date {
		const [day, month, year] = BRHumanDate.split(" de ")

		const monthMap: Record<string, number> = {
			janeiro: 0,
			fevereiro: 1,
			março: 2,
			abril: 3,
			maio: 4,
			junho: 5,
			julho: 6,
			agosto: 7,
			setembro: 8,
			outubro: 9,
			novembro: 10,
			dezembro: 11
		}

		const date = new Date()

		const formattedMonth = monthMap[month]
		date.setMonth(formattedMonth)

		const formattedDay = Number(day)
		date.setDate(formattedDay)

		const formattedYear = Number(year)
		date.setFullYear(formattedYear)

		return date
	}

	/**
	 * Source code:
	 * - https://stackoverflow.com/a/27125580/3307678
	 */
	getDateWeekDay (date: Date): number {
		const firstJanuary = new Date(date.getFullYear(), 0, 1)
		const firstJanuaryWeekDay = firstJanuary.getDay()

		const millisecondsDifference = date.getTime() - firstJanuary.getTime()
		const weekDaysDifference = millisecondsDifference / 86400000
		const totalWeekDays = weekDaysDifference + firstJanuaryWeekDay

		const totalAmountOfDaysInWeek = 7

		const dateWeekDay = totalWeekDays / totalAmountOfDaysInWeek
		const formattedDateWeekDay = Math.ceil(dateWeekDay)

		return formattedDateWeekDay
	}

	isSameWeek (dateA: Date, dateB: Date): boolean {
		return this.getDateWeekDay(dateA) === this.getDateWeekDay(dateB)
	}

	getTodayDate (): Date {
		const today = new Date()

		today.setUTCHours(0, 0, 0, 0)

		return today
	}
}

export default new DateUtil()
