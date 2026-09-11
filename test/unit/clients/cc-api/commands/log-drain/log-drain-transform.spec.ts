import { describe, expect, it } from 'vitest';
import {
  transformAuditLogDrain,
  transformLogDrain,
  transformLogDrainProbeResult,
} from '../../../../../../src/clients/cc-api/commands/log-drain/log-drain-transform.js';

describe('log-drain-transform', () => {
  describe('transformLogDrain', () => {
    const drainPayload = {
      id: 'drain_01KW9S8ZPGV3D2TSVVXWJZR79K',
      resourceId: 'app_5cd7548d-251f-4ee4-ad4d-3144aa6b3bdc',
      kind: 'LOG' as const,
      recipient: { type: 'SYSLOG_UDP' as const, url: 'syslog://logs.example.com:514' },
      status: { date: '2026-08-20T17:42:01.888Z', status: 'ENABLED' as const },
      execution: { status: 'RUNNING' as const },
    };

    // the drain of an add-on names its `realId`, not the `addon_` identifier the command was asked with
    it('should name the resource the payload reports', () => {
      const drain = transformLogDrain({ ...drainPayload, resourceId: 'postgresql_1a2b3c4d' });

      expect(drain.resourceId).toBe('postgresql_1a2b3c4d');
    });

    it('should transform every field', () => {
      const drain = transformLogDrain(drainPayload);

      expect(drain).toEqual({
        id: 'drain_01KW9S8ZPGV3D2TSVVXWJZR79K',
        resourceId: 'app_5cd7548d-251f-4ee4-ad4d-3144aa6b3bdc',
        kind: 'LOG',
        target: { type: 'SYSLOG_UDP', url: 'syslog://logs.example.com:514' },
        updatedAt: '2026-08-20T17:42:01.888Z',
        status: 'ENABLED',
        updatedBy: undefined,
        errorReason: undefined,
        execution: {
          status: 'RUNNING',
          lastError: undefined,
          attempt: undefined,
          maxAttempt: undefined,
          lastAttemptAt: undefined,
          nextAttemptAt: undefined,
          retryingSince: undefined,
        },
        backlog: undefined,
      });
    });

    // an audit log drain belongs to the organisation itself, so the payload carries a null resourceId
    it('should publish a target kind it does not know as the unknown variant', () => {
      const recipient = { type: 'BRAND_NEW', url: 'https://logs.example.com' };

      const drain = transformLogDrain({ ...drainPayload, recipient });

      expect(drain.target).toEqual({ type: 'UNKNOWN_TO_CLIENT', payload: recipient });
    });

    it('should leave the resource out of an audit log drain', () => {
      const drain = transformAuditLogDrain({ ...drainPayload, kind: 'AUDITLOG', resourceId: null });

      expect(drain.kind).toBe('AUDITLOG');
      expect(drain).not.toHaveProperty('resourceId');
      expect(drain.id).toBe('drain_01KW9S8ZPGV3D2TSVVXWJZR79K');
      expect(drain.updatedAt).toBe('2026-08-20T17:42:01.888Z');
    });
  });

  describe('transformLogDrainProbeResult', () => {
    // the API leaves out the transport of a probe that timed out before any of them answered, and with it
    // every detail block
    it('should build the variant without a transport when the API reports none', () => {
      const probe = transformLogDrainProbeResult({
        ok: false,
        code: 'probe-timeout',
        message: 'Probe of https://logs.example.com exceeded 8s',
        durationMs: 8000,
      });

      expect(probe).toEqual({
        ok: false,
        code: 'probe-timeout',
        message: 'Probe of https://logs.example.com exceeded 8s',
        duration: 'PT8S',
      });
    });

    it('should publish a transport it does not know as the unknown variant', () => {
      const payload = {
        ok: true,
        code: 'connected',
        message: 'QUIC connection to logs.example.com:514 succeeded',
        type: 'QUIC',
      };

      const probe = transformLogDrainProbeResult(payload);

      expect(probe).toEqual({ type: 'UNKNOWN_TO_CLIENT', payload });
    });

    it('should report the probe duration as an ISO 8601 duration', () => {
      const probe = transformLogDrainProbeResult({
        ok: true,
        code: 'connected',
        message: 'TCP connection to logs.example.com:514 succeeded',
        type: 'TCP',
        durationMs: 1234,
        tcp: { connected: true, host: 'logs.example.com', port: 514 },
      });

      expect(probe).toMatchObject({ duration: 'PT1.234S' });
    });

    it('should build the TCP variant with the outcome of the connection', () => {
      const probe = transformLogDrainProbeResult({
        ok: false,
        code: 'connection-refused',
        message: 'TCP connection to logs.example.com:514 was refused',
        type: 'TCP',
        tcp: { connected: false, host: 'logs.example.com', port: 514 },
      });

      expect(probe).toEqual({
        ok: false,
        code: 'connection-refused',
        message: 'TCP connection to logs.example.com:514 was refused',
        type: 'TCP',
        duration: undefined,
        tcp: { wasConnected: false, host: 'logs.example.com', port: 514 },
      });
    });

    it('should build the HTTP variant with the request and the response', () => {
      const probe = transformLogDrainProbeResult({
        ok: true,
        code: 'http-2xx',
        message: 'POST https://logs.example.com/intake returned 200',
        type: 'HTTP',
        http: {
          request: {
            method: 'POST',
            url: 'https://logs.example.com/intake',
            headers: { 'Content-Type': 'application/json' },
            body: '[{"message":"probe"}]',
          },
          response: { statusCode: 200, headers: { Via: ['1.1 one', '1.1 two'] }, body: '{"status":"ok"}' },
        },
      });

      expect(probe).toEqual({
        ok: true,
        code: 'http-2xx',
        message: 'POST https://logs.example.com/intake returned 200',
        type: 'HTTP',
        duration: undefined,
        http: {
          request: {
            method: 'POST',
            url: 'https://logs.example.com/intake',
            headers: { 'Content-Type': 'application/json' },
            body: '[{"message":"probe"}]',
          },
          response: { statusCode: 200, headers: { Via: ['1.1 one', '1.1 two'] }, body: '{"status":"ok"}' },
        },
      });
    });

    // a DNS, connection or TLS failure never produces an HTTP response, and a request the probe sent without
    // a body reports none
    it('should leave the response absent when the recipient answered nothing', () => {
      const probe = transformLogDrainProbeResult({
        ok: false,
        code: 'unknown-host',
        message: 'Host logs.example.com could not be resolved',
        type: 'HTTP',
        http: {
          request: { method: 'POST', url: 'https://logs.example.com/intake', headers: {}, body: null },
          response: null,
        },
      });

      expect(probe.type).toBe('HTTP');
      if (probe.type === 'HTTP') {
        expect(probe.http.response).toBeUndefined();
        expect(probe.http.request.body).toBeUndefined();
      }
    });

    // UDP delivery is not acknowledged, so the recipient is never probed and there is nothing to detail
    it('should build the UDP variant with no detail block', () => {
      const probe = transformLogDrainProbeResult({
        ok: true,
        code: 'skipped',
        message: 'UDP drains have no acknowledgement; probe is skipped',
        type: 'UDP',
        durationMs: 0,
      });

      expect(probe).toEqual({
        ok: true,
        code: 'skipped',
        message: 'UDP drains have no acknowledgement; probe is skipped',
        type: 'UDP',
        duration: 'PT0S',
      });
    });
  });
});
