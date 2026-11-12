import { classMemberPrivacy } from './class-member-privacy.ts';

/**
 * Oxlint plugin with the rules of this repository.
 */
export default {
  meta: { name: 'clever-client' },
  rules: {
    'class-member-privacy': classMemberPrivacy,
  },
};
