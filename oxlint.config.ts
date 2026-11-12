import { defineConfig } from 'oxlint';

const LOOSE_TYPES_RULES = {
  'typescript/no-explicit-any': 'off',
  'typescript/no-unsafe-argument': 'off',
  'typescript/no-unsafe-assignment': 'off',
  'typescript/no-unsafe-call': 'off',
  'typescript/no-unsafe-member-access': 'off',
  'typescript/no-unsafe-return': 'off',
} as const;

export default defineConfig({
  jsPlugins: ['eslint-plugin-perfectionist', './tasks/oxlint-plugin/index.ts'],
  categories: {
    correctness: 'error',
  },
  options: {
    typeAware: true,
  },
  ignorePatterns: ['**/dist/'],
  rules: {
    // Enforce the use of 'import from node:xxx' instead of 'import from xxx'
    'unicorn/prefer-node-protocol': 'error',

    // Relative imports use the `.ts` extension, which Node runs as is and `tsc` rewrites to `.js` in `dist/`
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.{1,2}/.*\\.[cm]?js$',
            message: 'Use the `.ts` extension in relative imports.',
          },
        ],
      },
    ],

    // Import declarations are sorted by Oxfmt (`sortImports`), by module path. This rule only sorts the specifiers
    // inside the braces: its own declaration sort uses the first imported name and would conflict with Oxfmt.
    'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
    // Sort the specifiers inside the braces of exports, and `export ... from` declarations by module path
    'perfectionist/sort-named-exports': 'error',
    'perfectionist/sort-exports': 'error',

    // Private class members use the `private` modifier and a `_` prefix, never `#`
    'clever-client/class-member-privacy': 'error',

    // Part of the correctness category, listed for its options: names prefixed with `_` may stay unused
    'no-unused-vars': [
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

    // Rules from `eslint:recommended` outside the correctness category
    'no-array-constructor': 'error',
    'no-case-declarations': 'error',
    'no-empty': 'error',
    'no-fallthrough': 'error',
    'no-prototype-builtins': 'error',
    'no-regex-spaces': 'error',
    'no-unexpected-multiline': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',

    // Rules from `typescript-eslint` recommended outside the correctness category
    'typescript/ban-ts-comment': 'error',
    // Enforce the use of 'import type' for importing types
    'typescript/consistent-type-imports': [
      'error',
      { fixStyle: 'inline-type-imports', disallowTypeAnnotations: false },
    ],
    'typescript/no-empty-object-type': 'error',
    'typescript/no-explicit-any': 'error',
    // Enforce the use of top-level import type qualifier when an import only has specifiers with inline type qualifiers
    'typescript/no-import-type-side-effects': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unsafe-function-type': 'error',

    // Type-aware rules from `typescript-eslint` recommended outside the correctness category
    'typescript/no-base-to-string': 'error',
    'typescript/no-misused-promises': 'error',
    'typescript/no-redundant-type-constituents': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/no-unsafe-argument': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-enum-comparison': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/only-throw-error': 'error',
    'typescript/prefer-promise-reject-errors': 'error',
    'typescript/require-await': 'error',
    'typescript/restrict-plus-operands': 'error',
    'typescript/restrict-template-expressions': 'error',
  },
  overrides: [
    // Transform functions map untyped raw API payloads field by field, so the `any` family of type-aware rules is
    // unavoidable noise there. Command files type their inputs and outputs and stay strict.
    {
      files: ['**/*-transform.ts'],
      rules: LOOSE_TYPES_RULES,
    },
    // The legacy client keeps loose types, and its JavaScript callers may omit the fields its types require.
    {
      files: ['esm/**/*.ts'],
      rules: {
        ...LOOSE_TYPES_RULES,
        'typescript/no-useless-default-assignment': 'off',
      },
    },
  ],
});
