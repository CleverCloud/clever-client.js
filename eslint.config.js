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
      // During the .js -> .ts migration, `.js` files import already-converted modules via `.js`
      // specifiers that resolve to `.ts` on disk. ESLint resolvers can't follow that mapping;
      // tsc (checkJs) is the resolution authority, so disable the resolution-checking rules.
      'import-x/no-unresolved': 'off',
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
  // Transform functions map untyped raw API payloads field by field, so the `any` family of
  // type-checked rules is unavoidable noise here. Command files type their inputs/outputs
  // properly and stay strict — only the *-transform.ts files relax these.
  {
    name: 'project-transform-payloads',
    files: ['**/*-transform.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  // Hand-written type-contract sidecars use empty interfaces as intentional stubs for
  // unmodeled/empty API responses; that pattern is fine here (unlike in real code).
  {
    name: 'project-type-declarations',
    files: ['**/*.types.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  // Test specs use async mock callbacks that conform to promise-returning signatures without
  // awaiting anything; require-await fights that idiomatic pattern.
  {
    name: 'project-test-ts',
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/require-await': 'off',
    },
  },
  // Store backends implement the async (Promise-returning) `Store` interface, but some are
  // synchronous internally (memory, fs, localStorage); keeping `async` preserves the public
  // throw-as-rejection contract, so require-await is noise here.
  {
    name: 'project-cc-api-stores',
    files: ['src/clients/cc-api/lib/store/**/*.ts'],
    rules: {
      '@typescript-eslint/require-await': 'off',
    },
  },
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
      // See the browser block: these resolution checks can't follow `.js` -> `.ts`; tsc covers it.
      'import-x/no-unresolved': 'off',
      'n/no-missing-import': 'off',
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
