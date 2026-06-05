// @ts-ignore - JS-only package that ships no type declarations
import { cleverCloud } from '@clevercloud/eslint-config';
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    name: 'ignores',
    ignores: ['dist/**'],
  },
  {
    name: 'ts',
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
  },
  // Transform functions map untyped raw API payloads field by field, so the `any` family of
  // type-checked rules is unavoidable noise here. Command files type their inputs/outputs
  // properly and stay strict — only the *-transform.ts files relax these.
  {
    name: 'transform-api-payloads',
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
  // Relax the type-aware safety rules for the old legacy client.
  {
    name: 'legacy-esm-loose-types',
    files: ['esm/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      camelcase: 'off',
    },
  },
  // The build/test config files themselves. Unlike the isomorphic `ts` block above, these run only
  // in Node, so they get the full `globals.node` set (process, __dirname, etc.) and the cleverCloud
  // node rule set rather than the shared es2023 globals.
  {
    name: 'tooling-config-files',
    files: ['eslint.config.js', 'vitest.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: cleverCloud.configs.node.plugins,
    rules: {
      ...cleverCloud.configs.node.rules,
      'import-x/no-extraneous-dependencies': [
        'off',
        { devDependencies: true, optionalDependencies: false, peerDependencies: false },
      ],
      'import-x/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
  // Build/codegen scripts under `tasks/` parse untyped raw payloads (OpenAPI specs fetched as JSON,
  // Babel ASTs), so the `any` family of type-checked rules is unavoidable noise here — same rationale
  // as the `*-transform.ts` block above. `require-await` is also relaxed: some functions stay `async`
  // to honor a Promise-returning contract even when their body has nothing to await.
  {
    name: 'tooling-tasks',
    files: ['tasks/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
]);
