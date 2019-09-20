import { getStatus } from '../esm/utils/app-status.js';

describe('app-status#getStatus()', () => {

  test('stopped', () => {
    const app = { state: 'SHOULD_BE_DOWN' };
    const deployments = null;
    const instances = null;
    const status = getStatus(app, deployments, instances);
    expect(status).toBe('stopped');
  });

  test('starting', () => {
    const app = { state: 'WANTS_TO_BE_UP' };
    const deployments = [{ state: 'WIP' }];
    const instances = [];
    const status = getStatus(app, deployments, instances);
    expect(status).toBe('starting');
  });

  test('start-failed', () => {
    const app = { state: 'WANTS_TO_BE_UP' };
    const deployments = [{ state: 'FAIL' }];
    const instances = [];
    const status = getStatus(app, deployments, instances);
    expect(status).toBe('start-failed');
  });

  test('restarting', () => {
    const app = { state: 'SHOULD_BE_UP', homogeneous: false };
    const deployments = [{ state: 'WIP' }];
    const instances = [{ state: 'UP' }];
    const status = getStatus(app, deployments, instances);
    expect(status).toBe('restarting');
  });

  test('running (last deploy failed)', () => {
    const app = { state: 'SHOULD_BE_UP' };
    const deployments = [{ state: 'FAIL' }];
    const instances = [{ state: 'UP' }];
    const status = getStatus(app, deployments, instances);
    expect(status).toBe('restart-failed');
  });

  test('restarting-with-downtime', () => {
    const app = { state: 'SHOULD_BE_UP', homogeneous: true };
    const deployments = [{ state: 'WIP' }];
    const instances = [];
    const status = getStatus(app, deployments, instances);
    expect(status).toBe('restarting-with-downtime');
  });

  test('running', () => {
    const app = { state: 'SHOULD_BE_UP' };
    const deployments = [];
    const instances = [{ state: 'UP' }];
    const status = getStatus(app, deployments, instances);
    expect(status).toBe('running');
  });

  test('unknown (WANTS_TO_BE_UP, deploy OK but not instance)', () => {
    const app = { state: 'WANTS_TO_BE_UP' };
    const deployments = [{ state: 'OK' }];
    const instances = [];
    const status = getStatus(app, deployments, instances);
    expect(status).toBe('unknown');
  });
});
