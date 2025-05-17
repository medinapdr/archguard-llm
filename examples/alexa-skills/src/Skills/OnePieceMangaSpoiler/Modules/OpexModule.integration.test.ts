import OpexModule from "@/Skills/OnePieceMangaSpoiler/Modules/OpexModule"

describe("OpexModule", () => {
	describe("lookup()", () => {
		test("Should not throw when looking up a spoiler", async () => {
			const getSpoilerInfoPromise = OpexModule.getSpoilerInfo()

			await expect(getSpoilerInfoPromise).resolves.not.toThrow()
		})
	})
})
