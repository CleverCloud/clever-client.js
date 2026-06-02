import { cleverCloud } from '@clevercloud/eslint-config';
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    name: 'project-ignores',
    ignores: ['**/*.d.ts', 'dist/**', 'build/**'],
  },
  {
    ...cleverCloud.configs.browser,
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      ...cleverCloud.configs.browser.rules,
      'import-x/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
  ...tseslint.config({
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: {
        projectService: true,
      },
      // We keep only the es2023 shared globals (kept in sync with ecmaVersion above) — not browser+node unions —
      // because the code targets both browser and Node.js
      globals: globals.es2023,
    },
    rules: {
      // Enforce the use of 'import type' for importing types
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      // Enforce the use of top-level import type qualifier when an import only has specifiers with inline type qualifiers
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  }),
  {
    ...cleverCloud.configs.node,
    files: ['eslint.config.js', 'vitest.config.js', 'tasks/**/*.js', 'test-*.config.*.*js', 'test/**/*.*js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...cleverCloud.configs.node.rules,
      'import-x/no-extraneous-dependencies': [
        'off',
        { devDependencies: true, optionalDependencies: false, peerDependencies: false },
      ],
      'import-x/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
  // Specific rules for generated client files
  {
    name: 'generated-client-context',
    files: ['esm/api/**/*.js'],
    rules: {
      camelcase: ['off'],
    },
  },
];
