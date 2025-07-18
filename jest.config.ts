import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  fakeTimers: { enableGlobally: true },
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/**/*.{ts,tsx}", "!<rootDir>/src/utils/"],
  coveragePathIgnorePatterns: ["/node_modules/", "/test-action/1.0/", "/background-action/1.0/"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;
