module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['cypress', '@typescript-eslint', 'prettier'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    'cypress/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};
