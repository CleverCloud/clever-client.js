import { cleverCloud } from '@clevercloud/eslint-config';
import globals from 'globals';

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
