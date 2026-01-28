import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    ignores: [
      "./node_modules/",
      "./functions/",
      "./src/utils/liquidjs/liquid.min.js",
      "./src/test-action/1.0/index.ts",
      "./src/utils/templating/templayed.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        documentParser: "readonly",
        generatePDF: "readonly",
        generativeAI: "readonly",
        gql: "readonly",
        parseData: "readonly",
        parseToGqlFragment: "readonly",
        runAction: "readonly",
        searchCollection: "readonly",
        smtp: "readonly",
        storeFile: "readonly",
        $app: "readonly",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];
