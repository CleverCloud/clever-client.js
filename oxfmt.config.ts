import { defineConfig } from 'oxfmt';

export default defineConfig({
  arrowParens: 'always',
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  sortPackageJson: false,
  ignorePatterns: ['node_modules', 'dist', 'pnpm-lock.yaml', '.changeset', '**/*.md'],
  // Sort import declarations by module path: non-relative imports first, then relative ones, in a single block.
  // Specifiers inside the braces and exports are sorted by Oxlint (see `oxlint.config.ts`).
  sortImports: {
    groups: [
      ['builtin', 'external', 'internal', 'unknown'],
      ['parent', 'sibling', 'index'],
    ],
    newlinesBetween: false,
  },
});
