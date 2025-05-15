import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  fakeTimers: { enableGlobally: true },
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/**/*.{ts,tsx}", "!<rootDir>/src/utils/"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
