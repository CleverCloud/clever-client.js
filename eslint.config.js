import { cleverCloud } from '@clevercloud/eslint-config';
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    name: 'project-ignores',
    // `**/*.d.ts` covers the remaining hand-written declaration sidecars under
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
  // Build/codegen scripts under `tasks/` parse untyped raw payloads (OpenAPI specs fetched as JSON,
  // Babel ASTs), so the `any` family of type-checked rules is unavoidable noise here — same rationale
  // as the `*-transform.ts` block above. `require-await` is also relaxed: some functions stay `async`
  // to honor a Promise-returning contract even when their body has nothing to await.
  {
    name: 'project-tasks',
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
  {
    ...cleverCloud.configs.node,
    files: ['eslint.config.js', 'vitest.config.js'],
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
    files: ['esm/api/**/*.ts'],
    rules: {
      camelcase: ['off'],
    },
  },
  // The legacy `esm/` client was migrated from JSDoc-typed JS to TypeScript. Its
  // request/streaming layers and generated endpoints are intentionally loosely
  // typed (dynamic SSE/WS payloads, untyped JSON response bodies, error objects),
  // mirroring the `any`/`*`/`Object` JSDoc they carried as JS. Relax the
  // type-aware safety rules here rather than papering over genuinely dynamic data.
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
    },
  },
];
