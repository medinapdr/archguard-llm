const colors = require("tailwindcss/colors")

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./client/**/*.{js,ts,jsx,tsx}",
		"./node_modules/flowbite/**/*.js"
	],
	theme: {
		colors: {
			white: colors.white,
			red: colors.red,
			green: {
				"50": "#e8fcf2",
				"100": "#d0f9e5",
				"200": "#b9f5d9",
				"300": "#a2f2cc",
				"400": "#8befbf",
				"500": "#73ecb2",
				"600": "#5ce9a5",
				"700": "#45e599",
				"800": "#2de28c",
				"900": "#16df7f",
			},
			gray: {
				"50": "#eaeaea",
				"100": "#d5d5d5",
				"200": "#c0c0c0",
				"300": "#ababab",
				"400": "#969696",
				"500": "#808080",
				"600": "#6b6b6b",
				"700": "#565656",
				"800": "#414141",
				"900": "#2c2c2c"
			}
		},
		fontFamily: {
			sans: ["Noto Sans", "sans-serif"],
			serif: ["Noto Sans", "serif"],
		},
		extend: {},
	},
	plugins: [],
}
