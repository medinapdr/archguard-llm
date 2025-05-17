import DateUtil from "@/Skills/OnePieceMangaSpoiler/Utils/DateUtil"

describe("DateUtil", () => {
	describe("turnBRHumanDateIntoDate()", () => {
		test("Should get a valid date from brazilian human date", async () => {
			const BRHumanDate = "31 de outubro de 2022"

			const date = DateUtil.turnBRHumanDateIntoDate(BRHumanDate)

			const formattedDate = new Intl.DateTimeFormat("pt-BR").format(date)

			expect(formattedDate).toBe("31/10/2022")
		})
	})
})
