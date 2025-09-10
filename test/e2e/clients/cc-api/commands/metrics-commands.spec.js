import { expect } from 'chai';
import { GetMetricsCommand } from '../../../../../src/clients/cc-api/commands/metrics/get-metrics-command.js';
import { e2eSupport, STATIC_MYSQL_ADDON_ID } from '../e2e-support.js';

describe('metrics commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should get addon memory metrics', async () => {
    const response = await support.client.send(
      new GetMetricsCommand({ addonId: STATIC_MYSQL_ADDON_ID, metrics: ['mem'] }),
    );

    expect(response.mem).to.be.an('array');
    expect(response.mem[0].timestamp).to.be.a('number');
    expect(response.mem[0].value).to.be.a('number');
  });

  it('should get addon metrics', async () => {
    const response = await support.client.send(new GetMetricsCommand({ addonId: STATIC_MYSQL_ADDON_ID }));

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
