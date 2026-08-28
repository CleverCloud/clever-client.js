import { describe, expect, it } from 'vitest';
import { transformLogDrainProbeResult } from '../../../../../../src/clients/cc-api/commands/log-drain/log-drain-transform.js';

describe('log-drain-transform', () => {
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

    it('should report the probe duration as an ISO 8601 duration', () => {
      const probe = transformLogDrainProbeResult({
        ok: true,
        code: 'connected',
        message: 'TCP connection to logs.example.com:514 succeeded',
        type: 'TCP',
        durationMs: 1234,
        tcp: { connected: true, host: 'logs.example.com', port: 514 },
      });

      expect(probe.duration).toBe('PT1.234S');
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
