import { describe, expect, it } from 'vitest';
import { transformGithubApplication } from '../../../../../../src/clients/cc-api/commands/github/github-transform.js';

/** A payload as `OAuthApplicationView` serialises it, built from the GitHub repository. */
function getGithubApplicationPayload() {
  return {
    id: '123456789',
    owner: 'CleverCloud',
    name: 'clever-client.js',
    description: 'A JavaScript REST client',
    gitUrl: 'https://github.com/CleverCloud/clever-client.js.git',
    defaultBranch: 'master',
    priv: false,
  };
}

describe('github-transform', () => {
  describe('transformGithubApplication', () => {
    it('should read a repository with no description as undefined', () => {
      const application = transformGithubApplication({ ...getGithubApplicationPayload(), description: null });

      expect(application.description).toBeUndefined();
    });

    it('should keep the identifier as the string the API sends', () => {
      const application = transformGithubApplication(getGithubApplicationPayload());

      expect(application.id).toBe('123456789');
    });
  });
});
