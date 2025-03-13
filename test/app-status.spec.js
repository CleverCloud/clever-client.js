import { expect } from '@esm-bundle/chai';
import { getStatus } from '../esm/utils/app-status.js';

describe('app-status#getStatus()', () => {
  it('stopped', () => {
    const app = { state: 'SHOULD_BE_DOWN' };
    const deployments = null;
    const instances = null;
    const status = getStatus(app, deployments, instances);
    expect(status).to.equal('stopped');
  });

  it('starting', () => {
    const app = { state: 'WANTS_TO_BE_UP' };
    const deployments = [{ state: 'WIP' }];
    const instances = [];
    const status = getStatus(app, deployments, instances);
    expect(status).to.equal('starting');
  });

  it('start-failed', () => {
    const app = { state: 'WANTS_TO_BE_UP' };
    const deployments = [{ state: 'FAIL' }];
    const instances = [];
    const status = getStatus(app, deployments, instances);
    expect(status).to.equal('start-failed');
  });

  it('restarting', () => {
    const app = { state: 'SHOULD_BE_UP', homogeneous: false };
    const deployments = [{ state: 'WIP' }];
    const instances = [{ state: 'UP' }];
    const status = getStatus(app, deployments, instances);
    expect(status).to.equal('restarting');
  });

  it('running (last deploy failed)', () => {
    const app = { state: 'SHOULD_BE_UP' };
    const deployments = [{ state: 'FAIL' }];
    const instances = [{ state: 'UP' }];
    const status = getStatus(app, deployments, instances);
    expect(status).to.equal('restart-failed');
  });

  it('restarting-with-downtime', () => {
    const app = { state: 'SHOULD_BE_UP', homogeneous: true };
    const deployments = [{ state: 'WIP' }];
    const instances = [];
    const status = getStatus(app, deployments, instances);
    expect(status).to.equal('restarting-with-downtime');
  });

  it('running', () => {
    const app = { state: 'SHOULD_BE_UP' };
    const deployments = [];
    const instances = [{ state: 'UP' }];
    const status = getStatus(app, deployments, instances);
    expect(status).to.equal('running');
  });

  it('unknown (WANTS_TO_BE_UP, deploy OK but not instance)', () => {
    const app = { state: 'WANTS_TO_BE_UP' };
    const deployments = [{ state: 'OK' }];
    const instances = [];
    const status = getStatus(app, deployments, instances);
    expect(status).to.equal('unknown');
  });
});
