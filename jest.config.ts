import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  collectCoverage: process.env.CI === "true",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/**/function.json",
  ],
  fakeTimers: {
    enableGlobally: true,
  },
  coverageProvider: "v8",
  coveragePathIgnorePatterns: [
    "/test-action/1.0/",
    "/background-action/1.0/",
    "/utils/templating/templayed.ts",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/functions/"],
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
