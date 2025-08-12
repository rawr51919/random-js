import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    plugins: {
      '@typescript-eslint': ts,
    },
    languageOptions: {
      parser: tsParser
    },
    rules: {
      'no-bitwise': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
    },
  },
];
