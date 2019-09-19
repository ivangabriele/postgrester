// https://basarat.gitbooks.io/typescript/docs/testing/jest.html

module.exports = {
  bail: true,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/src"],
  testRegex: `(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$`,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: true
};
