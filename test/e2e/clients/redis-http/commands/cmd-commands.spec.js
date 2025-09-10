import { expect } from 'chai';
import { CmdCliSendCommand } from '../../../../../src/clients/redis-http/commands/cmd/cmd-cli-send-command.js';
import { CmdSendCommand } from '../../../../../src/clients/redis-http/commands/cmd/cmd-send-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('cmd commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should run command', async () => {
    const response = await support.client.send(new CmdSendCommand({ command: 'PING' }));

    expect(response.result).to.equal('PONG');
  });

  it('should run cli command', async () => {
    const response = await support.client.send(new CmdCliSendCommand({ commandLine: 'PING' }));

    expect(response.success).to.equal(true);
    expect(response.result).to.be.an('array');
    expect(response.result[0]).to.equal(`"PONG"`);
  });
});
