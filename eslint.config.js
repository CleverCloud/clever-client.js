import { includeIgnoreFile } from '@eslint/compat';
import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';
import path from 'node:path';
import cleverCloudEsm from './eslint/eslint-config-clever-cloud-esm.js';

const gitignorePath = path.resolve('./', '.gitignore');

export default [
  // common ignores
  includeIgnoreFile(gitignorePath),
  {
    name: 'project-ignores',
    ignores: ['**/*.d.ts'],
  },
  cleverCloudEsm,
  // Allow importing dev dependencies for files that are related to build / tooling / testing
  {
    name: 'allow-extraneous-imports',
    files: ['test/**/*.*js', 'eslint.config.js', 'eslint/**/*.*js', 'tasks/**/*.js', 'web-test-runner.config.js'],
    rules: {
      'import/no-extraneous-dependencies': [
        'off',
        { devDependencies: true, optionalDependencies: false, peerDependencies: false },
      ],
    },
  },
  // Inject Mocha globals into tests
  {
    name: 'mocha-context',
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  // Specific rules for node esm modules
  {
    name: 'node-esm-context',
    files: ['tasks/**/*.js', 'web-test-runner.config.js', 'manual_tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      n: nodePlugin,
    },
    rules: {
      ...nodePlugin.configs['flat/recommended-script'].rules,
      'n/no-process-exit': 'off',
      'n/no-extraneous-import': 'off',
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
