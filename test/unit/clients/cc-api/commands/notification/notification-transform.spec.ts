import { describe, expect, it } from 'vitest';
import { transformNotificationInfoEvents } from '../../../../../../src/clients/cc-api/commands/notification/notification-transform.js';

/**
 * Mirrors the shape of `GET /v2/notifications/info/events`: `meta_events` is an array of
 * `{ key, events }`, and `events` lists the meta events alongside the individual ones.
 */
function buildInfoEventsPayload() {
  return {
    events: [
      'ACCOUNT_CREATION',
      'APPLICATION_CREATION',
      'APPLICATION_DELETION',
      'CREDITS_ADDED',
      'DEPLOYMENT_FAIL',
      'DEPLOYMENT_SUCCESS',
      'META_SERVICE_LIFECYCLE',
      'META_DEPLOYMENT_RESULT',
      'META_SERVICE_MANAGEMENT',
      'META_CREDITS',
    ],
    meta_events: [
      { key: 'META_SERVICE_LIFECYCLE', events: ['APPLICATION_CREATION', 'APPLICATION_DELETION'] },
      { key: 'META_DEPLOYMENT_RESULT', events: ['DEPLOYMENT_FAIL', 'DEPLOYMENT_SUCCESS'] },
      { key: 'META_SERVICE_MANAGEMENT', events: ['APPLICATION_EDITION', 'APPLICATION_REDEPLOY'] },
      { key: 'META_CREDITS', events: ['CREDITS_ADDED'] },
    ],
  };
}

describe('notification-transform', () => {
  describe('transformNotificationInfoEvents', () => {
    it('should key the meta events by their key', () => {
      const info = transformNotificationInfoEvents(buildInfoEventsPayload());

      expect(info.metaEvents).toEqual({
        META_SERVICE_LIFECYCLE: ['APPLICATION_CREATION', 'APPLICATION_DELETION'],
        META_DEPLOYMENT_RESULT: ['DEPLOYMENT_FAIL', 'DEPLOYMENT_SUCCESS'],
        META_SERVICE_MANAGEMENT: ['APPLICATION_EDITION', 'APPLICATION_REDEPLOY'],
        META_CREDITS: ['CREDITS_ADDED'],
      });
    });

    it('should give every meta event the events it stands for', () => {
      const info = transformNotificationInfoEvents(buildInfoEventsPayload());

      for (const metaEvent of [
        'META_SERVICE_LIFECYCLE',
        'META_DEPLOYMENT_RESULT',
        'META_SERVICE_MANAGEMENT',
        'META_CREDITS',
      ] as const) {
        expect(info.metaEvents[metaEvent], `${metaEvent} should stand for at least one event`).toBeDefined();
        expect(info.metaEvents[metaEvent].length, `${metaEvent} should stand for at least one event`).toBeGreaterThan(
          0,
        );
      }
    });

    it('should keep the meta events listed among the events', () => {
      const info = transformNotificationInfoEvents(buildInfoEventsPayload());

      expect(info.events).toEqual(buildInfoEventsPayload().events);
      for (const metaEvent of Object.keys(info.metaEvents)) {
        expect(info.events).toContain(metaEvent);
      }
    });
  });
});
