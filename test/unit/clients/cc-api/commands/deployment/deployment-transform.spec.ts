import { describe, expect, it } from 'vitest';
import {
  transformDeployment,
  transformDeploymentLegacy,
} from '../../../../../../src/clients/cc-api/commands/deployment/deployment-transform.js';

/** A payload as the ovd `DeploymentView` serialises it. */
function getDeploymentPayload() {
  return {
    id: 'deployment_11111111-1111-1111-1111-111111111111',
    ownerId: 'orga_22222222-2222-2222-2222-222222222222',
    applicationId: 'app_33333333-3333-3333-3333-333333333333',
    startDate: '2026-09-11T10:00:00Z',
    state: 'WORK_IN_PROGRESS',
    steps: [
      { state: 'QUEUED', date: '2026-09-11T10:00:00Z' },
      { state: 'WORK_IN_PROGRESS', date: '2026-09-11T10:00:05Z' },
    ],
    version: {
      commitId: '4444444444444444444444444444444444444444',
      previousCommitId: '5555555555555555555555555555555555555555',
    },
    origin: {
      action: 'DEPLOY',
      cause: 'Console',
      source: 'api',
      authorId: 'user_66666666-6666-6666-6666-666666666666',
      constraints: [],
      priority: 'DEFAULT',
    },
    hasDedicatedBuild: false,
  };
}

/** A payload as the v2 `DeploymentView` serialises it. */
function getDeploymentLegacyPayload() {
  return {
    id: 12,
    uuid: 'deployment_11111111-1111-1111-1111-111111111111',
    date: 1757584800000,
    state: 'OK',
    action: 'DEPLOY',
    commit: '4444444444444444444444444444444444444444',
    cause: 'Console',
    instances: 1,
    author: { id: 'user_66666666-6666-6666-6666-666666666666', name: 'Someone' },
  };
}

describe('deployment-transform', () => {
  describe('transformDeployment', () => {
    it('should keep a payload key the client does not publish out of the nested objects', () => {
      const payload = getDeploymentPayload();

      const deployment = transformDeployment({
        ...payload,
        steps: [{ ...payload.steps[0], subSteps: [] }],
        version: { ...payload.version, buildId: 'build_1' },
        origin: { ...payload.origin, requestId: 'req_1' },
      });

      expect(Object.keys(deployment.steps[0])).not.toContain('subSteps');
      expect(Object.keys(deployment.version)).not.toContain('buildId');
      expect(Object.keys(deployment.origin)).not.toContain('requestId');
    });

    it('should convert every date to an ISO date string', () => {
      const deployment = transformDeployment({ ...getDeploymentPayload(), startDate: 1757584800000 });

      expect(deployment.startsAt).toBe(new Date(1757584800000).toISOString());
      expect(deployment.steps[0].date).toBe(new Date('2026-09-11T10:00:00Z').toISOString());
    });

    it('should read an absent optional field as undefined', () => {
      const payload = getDeploymentPayload();

      const deployment = transformDeployment({
        ...payload,
        version: { commitId: null, previousCommitId: null },
        origin: { ...payload.origin, cause: null, authorId: null },
      });

      expect(deployment.version.commitId).toBeUndefined();
      expect(deployment.version.previousCommitId).toBeUndefined();
      expect(deployment.origin.cause).toBeUndefined();
      expect(deployment.origin.authorId).toBeUndefined();
    });
  });

  describe('transformDeploymentLegacy', () => {
    it('should map the author instead of publishing the payload', () => {
      const payload = getDeploymentLegacyPayload();

      const deployment = transformDeploymentLegacy(
        { ...payload, author: { ...payload.author, email: 'someone@example.com' } },
        'app_33333333-3333-3333-3333-333333333333',
      );

      expect(deployment.author).toEqual({
        id: 'user_66666666-6666-6666-6666-666666666666',
        name: 'Someone',
      });
    });

    it('should read an absent optional field as undefined', () => {
      const deployment = transformDeploymentLegacy(
        { ...getDeploymentLegacyPayload(), commit: null, cause: null, author: { id: null, name: null } },
        'app_33333333-3333-3333-3333-333333333333',
      );

      expect(deployment.commit).toBeUndefined();
      expect(deployment.cause).toBeUndefined();
      expect(deployment.author.id).toBeUndefined();
      expect(deployment.author.name).toBeUndefined();
    });
  });
});
