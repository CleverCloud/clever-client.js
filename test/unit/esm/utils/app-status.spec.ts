import { describe, expect, it } from 'vitest';
import { getStatus } from '../../../../esm/utils/app-status.js';

describe('app-status#getStatus()', () => {
  it('stopped', () => {
    // @ts-expect-error testing null deployments/instances on the stopped path
    const status = getStatus({ state: 'SHOULD_BE_DOWN', homogeneous: false }, null, null);
    expect(status).toBe('stopped');
  });

  it('starting', () => {
    const status = getStatus({ state: 'WANTS_TO_BE_UP', homogeneous: false }, [{ state: 'WIP' }], []);
    expect(status).toBe('starting');
  });

  it('start-failed', () => {
    const status = getStatus({ state: 'WANTS_TO_BE_UP', homogeneous: false }, [{ state: 'FAIL' }], []);
    expect(status).toBe('start-failed');
  });

  it('restarting', () => {
    const status = getStatus({ state: 'SHOULD_BE_UP', homogeneous: false }, [{ state: 'WIP' }], [{ state: 'UP' }]);
    expect(status).toBe('restarting');
  });

  it('running (last deploy failed)', () => {
    const status = getStatus({ state: 'SHOULD_BE_UP', homogeneous: false }, [{ state: 'FAIL' }], [{ state: 'UP' }]);
    expect(status).toBe('restart-failed');
  });

  it('restarting-with-downtime', () => {
    const status = getStatus({ state: 'SHOULD_BE_UP', homogeneous: true }, [{ state: 'WIP' }], []);
    expect(status).toBe('restarting-with-downtime');
  });

  it('running', () => {
    const status = getStatus({ state: 'SHOULD_BE_UP', homogeneous: false }, [], [{ state: 'UP' }]);
    expect(status).toBe('running');
  });

  it('unknown (WANTS_TO_BE_UP, deploy OK but not instance)', () => {
    const status = getStatus({ state: 'WANTS_TO_BE_UP', homogeneous: false }, [{ state: 'OK' }], []);
    expect(status).toBe('unknown');
  });
});
