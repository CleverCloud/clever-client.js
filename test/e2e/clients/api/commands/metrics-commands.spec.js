import { expect } from 'chai';
import { GetMetricsCommand } from '../../../../../src/clients/api/commands/metrics/get-metrics-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

// cannot be automatised because it requires up time to have metrics
describe('metrics commands', function () {
  this.timeout(10000);

  const support = e2eSupport({ auth: 'DEV' });

  it('should get addon memory metrics', async () => {
    const response = await support.client.send(
      new GetMetricsCommand({
        addonId: 'addon_5b4a7c43-4b84-45e6-837c-153308182bf1',
        metrics: ['mem'],
      }),
    );

    expect(response.mem).to.be.an('array');
    expect(response.mem[0].timestamp).to.be.a('number');
    expect(response.mem[0].value).to.be.a('number');
  });

  it('should get addon metrics', async () => {
    const response = await support.client.send(
      new GetMetricsCommand({
        addonId: 'addon_5b4a7c43-4b84-45e6-837c-153308182bf1',
      }),
    );

    expect(response.cpu).to.be.an('array');
    expect(response.cpu[0].timestamp).to.be.a('number');
    expect(response.cpu[0].value).to.be.a('number');
    expect(response.mem).to.be.an('array');
    expect(response.mem[0].timestamp).to.be.a('number');
    expect(response.mem[0].value).to.be.a('number');
    expect(response.load1).to.be.an('array');
    expect(response.load1[0].timestamp).to.be.a('number');
    expect(response.load1[0].value).to.be.a('number');
  });
});
