module.exports = {
	roots: [
		"<rootDir>/src"
	],
	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1"
	},
	collectCoverageFrom: [
		"<rootDir>/src/**/*.ts"
	],
	coverageDirectory: "coverage",
	testEnvironment: "node",
	transform: {
		".+\\.ts$": "ts-jest"
	},
	testTimeout: 30000
}
