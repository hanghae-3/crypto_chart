module.exports = {
  root: true,
  env: { browser: true, es2021: true, jest: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:react/recommended"
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {}
    },
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs,jsx}"],
      rules: {
        "no-console": "warn",
        "no-alert": "warn"
      },
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ['react-refresh', "@typescript-eslint", "react"],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "import/extensions": ["off"],
    camelcase: "off",
    "no-unused-vars": "off",
    "react/react-in-jsx-scope": "off",
    "no-mixed-spaces-and-tabs": "off"
  },
}
