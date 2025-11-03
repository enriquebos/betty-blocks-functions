import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  fakeTimers: { enableGlobally: true },
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/**/*.{ts,tsx}", "!<rootDir>/src/utils/"],
  coveragePathIgnorePatterns: [
    "/test-action/1.0/",
    "/background-action/1.0/",
    "/utils/templating/templayed.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};

export default config;
