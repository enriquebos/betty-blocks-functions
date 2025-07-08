import tseslint from "typescript-eslint";

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
];
