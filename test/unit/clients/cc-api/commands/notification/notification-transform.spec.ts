import { describe, expect, it } from 'vitest';
import {
  transformNotificationInfoEvents,
  transformWebhookNotification,
} from '../../../../../../src/clients/cc-api/commands/notification/notification-transform.js';

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

/** A payload as `Json.format[Webhook]` serialises it, offset dates and all. */
function getWebhookPayload() {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    ownerId: 'orga_22222222-2222-2222-2222-222222222222',
    name: 'my-webhook',
    urls: [
      { url: 'https://example.com/hook', format: 'raw' },
      { url: 'https://hooks.slack.example.com/services/T0/B0/XX', format: 'slack' },
    ],
    events: ['DEPLOYMENT_SUCCESS', 'APPLICATION_CREATION'],
    scope: ['app_44444444-4444-4444-4444-444444444444', 'app_33333333-3333-3333-3333-333333333333'],
    createdAt: '2026-01-15T10:30:00+01:00',
    failures: [
      {
        url: 'https://example.com/hook',
        networkFailure: 'Connection refused',
        status: 502,
        partialBody: '<html><body>Bad gateway',
        createdAt: '2026-02-20T08:00:00+01:00',
      },
      {
        url: 'https://example.com/hook',
        createdAt: '2026-02-21T08:00:00+01:00',
      },
    ],
    state: 'ENABLED',
  };
}

describe('notification-transform', () => {
  describe('transformWebhookNotification', () => {
    it('should map each URL field by field', () => {
      const webhook = transformWebhookNotification(getWebhookPayload());

      expect(webhook.urls).toEqual([
        { url: 'https://example.com/hook', format: 'raw' },
        { url: 'https://hooks.slack.example.com/services/T0/B0/XX', format: 'slack' },
      ]);
    });

    it('should drop a URL key the client does not publish', () => {
      const payload = getWebhookPayload();

      const webhook = transformWebhookNotification({
        ...payload,
        urls: [{ ...payload.urls[0], template: '{{ message }}' }],
      });

      expect(Object.keys(webhook.urls[0])).not.toContain('template');
    });

    it('should map each failure field by field', () => {
      const webhook = transformWebhookNotification(getWebhookPayload());

      expect(webhook.failures[0]).toEqual({
        url: 'https://example.com/hook',
        networkFailure: 'Connection refused',
        status: 502,
        partialBody: '<html><body>Bad gateway',
        createdAt: '2026-02-20T07:00:00.000Z',
      });
    });

    it('should read an absent failure detail as undefined', () => {
      const webhook = transformWebhookNotification(getWebhookPayload());

      expect(webhook.failures[1].networkFailure).toBeUndefined();
      expect(webhook.failures[1].status).toBeUndefined();
      expect(webhook.failures[1].partialBody).toBeUndefined();
    });

    it('should drop a failure key the client does not publish', () => {
      const payload = getWebhookPayload();

      const webhook = transformWebhookNotification({
        ...payload,
        failures: [{ ...payload.failures[0], attempt: 3 }],
      });

      expect(Object.keys(webhook.failures[0])).not.toContain('attempt');
    });

    it('should normalise the creation date of the webhook and of every failure', () => {
      const webhook = transformWebhookNotification(getWebhookPayload());

      expect(webhook.createdAt).toBe('2026-01-15T09:30:00.000Z');
      expect(webhook.failures.map((failure) => failure.createdAt)).toEqual([
        '2026-02-20T07:00:00.000Z',
        '2026-02-21T07:00:00.000Z',
      ]);
    });

    it('should sort the events and the scopes like the email hook does', () => {
      const webhook = transformWebhookNotification(getWebhookPayload());

      expect(webhook.events).toEqual(['APPLICATION_CREATION', 'DEPLOYMENT_SUCCESS']);
      expect(webhook.scopes).toEqual([
        'app_33333333-3333-3333-3333-333333333333',
        'app_44444444-4444-4444-4444-444444444444',
      ]);
    });
  });

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
