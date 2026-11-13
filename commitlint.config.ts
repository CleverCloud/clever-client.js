import type { UserConfig } from '@commitlint/types';

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // The body has one sentence per line, never wrapped, whatever its length.
    'body-max-line-length': [0],
  },
} satisfies UserConfig;
