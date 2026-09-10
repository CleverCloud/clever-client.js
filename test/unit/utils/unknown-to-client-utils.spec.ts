import { describe, expect, it } from 'vitest';
import { unknownToClient } from '../../../src/lib/utils.js';
import type { Known } from '../../../src/utils/unknown-to-client-utils.js';
import { isKnown, isUnknown } from '../../../src/utils/unknown-to-client-utils.js';

interface Email {
  type: 'EMAIL';
  address: string;
}

interface Webhook {
  type: 'WEBHOOK';
  url: string;
}

type Target = Email | Webhook | ReturnType<typeof unknownToClient<'type'>>;

interface Started {
  event: 'STARTED';
  at: string;
}

type Event = Started | ReturnType<typeof unknownToClient<'event'>>;

const EMAIL: Target = { type: 'EMAIL', address: 'someone@example.com' };
const WEBHOOK: Target = { type: 'WEBHOOK', url: 'https://example.com/hook' };
const UNKNOWN_TARGET: Target = unknownToClient('type', { type: 'PIGEON', loft: 'roof' });
const STARTED: Event = { event: 'STARTED', at: '2026-09-11T10:00:00.000Z' };
const UNKNOWN_EVENT: Event = unknownToClient('event', { event: 'LANDED' });

describe('isUnknown', () => {
  it('should return true on the variant the client could not map', () => {
    expect(isUnknown(UNKNOWN_TARGET)).toBe(true);
  });

  it('should return false on a variant the client knows', () => {
    expect(isUnknown(EMAIL)).toBe(false);
  });

  it('should return true on a union discriminating on another key', () => {
    expect(isUnknown(UNKNOWN_EVENT, 'event')).toBe(true);
    expect(isUnknown(STARTED, 'event')).toBe(false);
  });

  it('should return false when the given discriminant is not the key the union uses', () => {
    expect(isUnknown(UNKNOWN_EVENT)).toBe(false);
  });

  it('should return false on a value that is not an object', () => {
    expect(isUnknown(null)).toBe(false);
    expect(isUnknown(undefined)).toBe(false);
    expect(isUnknown('UNKNOWN_TO_CLIENT')).toBe(false);
  });

  it('should narrow to the unknown variant', () => {
    if (!isUnknown(UNKNOWN_TARGET)) {
      throw new Error('expected the unknown variant');
    }
    expect(UNKNOWN_TARGET.payload).toEqual({ type: 'PIGEON', loft: 'roof' });
  });
});

describe('isKnown', () => {
  it('should return false on the variant the client could not map', () => {
    expect(isKnown(UNKNOWN_TARGET)).toBe(false);
  });

  it('should return true on a variant the client knows', () => {
    expect(isKnown(EMAIL)).toBe(true);
  });

  it('should return false on the unknown variant of a union discriminating on another key', () => {
    expect(isKnown(UNKNOWN_EVENT, 'event')).toBe(false);
    expect(isKnown(STARTED, 'event')).toBe(true);
  });

  it('should narrow to the variants the client knows', () => {
    if (!isKnown(EMAIL)) {
      throw new Error('expected a known variant');
    }
    const type: 'EMAIL' | 'WEBHOOK' = EMAIL.type;
    expect(type).toBe('EMAIL');
  });

  it('should drop the unknown variant from a list', () => {
    const targets: Array<Target> = [EMAIL, UNKNOWN_TARGET, WEBHOOK];

    const knownTargets: Array<Known<Target>> = targets.filter((target) => isKnown(target));

    expect(knownTargets).toEqual([EMAIL, WEBHOOK]);
  });

  it('should keep the unknown variant out of a switch', () => {
    const describeTarget = (target: Target): string => {
      if (!isKnown(target)) {
        return 'unknown';
      }
      switch (target.type) {
        case 'EMAIL':
          return target.address;
        case 'WEBHOOK':
          return target.url;
      }
    };

    expect(describeTarget(EMAIL)).toBe('someone@example.com');
    expect(describeTarget(UNKNOWN_TARGET)).toBe('unknown');
  });
});
