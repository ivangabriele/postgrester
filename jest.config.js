module.exports = {
  bail: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  testRegex: `(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$`,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  verbose: true,
};
