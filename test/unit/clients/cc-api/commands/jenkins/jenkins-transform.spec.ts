import { describe, expect, it } from 'vitest';
import { transformJenkinsUpdates } from '../../../../../../src/clients/cc-api/commands/jenkins/jenkins-transform.js';

describe('jenkins-transform', () => {
  describe('transformJenkinsUpdates', () => {
    it('should map the compared versions', () => {
      const updates = transformJenkinsUpdates({
        manageLink: 'https://jenkins.example.com/manage',
        versions: { current: '2.462.1', available: '2.479.3' },
      });

      expect(updates).toEqual({
        manageLink: 'https://jenkins.example.com/manage',
        versions: { current: '2.462.1', available: '2.479.3' },
      });
    });

    // both versions are Option[String] backend side, and are None when the add-on has no recorded version
    it('should leave the versions absent when the API sends none', () => {
      const updates = transformJenkinsUpdates({
        manageLink: 'https://jenkins.example.com/manage',
        versions: { current: null, available: null },
      });

      expect(updates.versions.current).toBeUndefined();
      expect(updates.versions.available).toBeUndefined();
    });
  });
});
