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
    "./src/**/**/*.ts": {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    "./src/utils/": {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    "./src/utils/templayed.ts": {
      branches: 40,
      functions: 70,
      lines: 90,
      statements: 70,
    },
  },
};

export default config;
