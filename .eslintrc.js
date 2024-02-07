// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: "18",
    },
  },
  extends: [
    "plugin:react/all",
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:unicorn/recommended",
    "plugin:consistent-default-export-name/fixed",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    indent: "off",
    "linebreak-style": ["error", "unix"],
    complexity: ["error", { max: 20 }],
    "import/no-unresolved": "off",
    "react/no-multi-comp": "off",
    "react/jsx-max-depth": 0,
    "react/require-default-props": "off",
    "react/jsx-no-literals": "off",
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    "unicorn/prefer-query-selector": "off",
    "unicorn/prefer-spread": "off",
    "unicorn/new-for-builtins": "off",
    "react/prefer-read-only-props": "off",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".tsx"] },
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
    "react/react-in-jsx-scope": "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
};
