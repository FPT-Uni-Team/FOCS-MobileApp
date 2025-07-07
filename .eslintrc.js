module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-native/all',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  env: {
    'react-native/react-native': true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Customize rules here
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-native/sort-styles': 'off',
    'react/no-unescaped-entities': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/no-raw-text': 'off',
    'no-empty': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
}; 