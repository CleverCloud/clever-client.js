import { expect } from 'chai';
import { ListLogCommand } from '../../../../../src/clients/cc-api/commands/log/list-log-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport, STATIC_MYSQL_ADDON_ID } from '../e2e-support.js';

describe('log commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should list addon log', async () => {
    const response = await support.client.send(new ListLogCommand({ addonId: STATIC_MYSQL_ADDON_ID }));

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    checkDateFormat(response[0].date);
    expect(response[0].message).to.be.a('string');
    expect(response[0].type).to.be.a('string');
    expect(response[0].severity).to.be.a('string');
    expect(response[0].program).to.be.a('string');
    expect(response[0].deploymentId).to.be.a('string');
    expect(response[0].sourceHost).to.be.a('string');
    expect(response[0].sourceIp).to.be.a('string');
    expect(response[0].zone).to.be.a('string');
  });

  it('should list addon log with options', async () => {
    const logs = await support.client.send(new ListLogCommand({ addonId: STATIC_MYSQL_ADDON_ID, limit: 1 }));
    const deploymentId = logs[0].deploymentId;

    const response = await support.client.send(
      new ListLogCommand({
        addonId: STATIC_MYSQL_ADDON_ID,
        deploymentId,
        limit: 10,
        order: 'DESC',
      }),
    );

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    checkDateFormat(response[0].date);
    expect(response[0].message).to.be.a('string');
    expect(response[0].type).to.be.a('string');
    expect(response[0].severity).to.be.a('string');
    expect(response[0].program).to.be.a('string');
    expect(response[0].deploymentId).to.be.a('string');
    expect(response[0].sourceHost).to.be.a('string');
    expect(response[0].sourceIp).to.be.a('string');
    expect(response[0].zone).to.be.a('string');
  });
});
