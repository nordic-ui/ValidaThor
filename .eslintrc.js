module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint', 'eslint-plugin-import-helpers'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    next: {
      rootDir: ['src/'],
    },

    '@typescript-eslint/ban-ts-comment': {
      node: {
        extensions: ['.ts', '!.test.ts'],
      },
    },
  },

  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.tsx'],
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: [['/^react/'], ['module'], ['/^~//'], ['parent', 'sibling', 'index']],
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        },
      },
    ],
  },
}
