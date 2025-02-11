/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  fakeTimers: { enableGlobally: true },
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
