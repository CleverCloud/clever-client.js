import { expect } from 'chai';
import { CreateStringKeyCommand } from '../../../../../src/clients/redis-http/commands/string-key/create-string-key-command.js';
import { GetStringKeyCommand } from '../../../../../src/clients/redis-http/commands/string-key/get-string-key-command.js';
import { UpdateStringKeyCommand } from '../../../../../src/clients/redis-http/commands/string-key/update-string-key-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('string-key commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.cleanup();
  });

  it('should create string key', async () => {
    const key = { key: 'test', value: 'v1' };
    const response = await support.client.send(new CreateStringKeyCommand(key));

    expect(response).to.deep.equal(key);
  });

  it('should get string key', async () => {
    const key = { key: 'test', value: 'v1' };
    await support.client.send(new CreateStringKeyCommand(key));

    const response = await support.client.send(new GetStringKeyCommand({ key: 'test' }));

    expect(response).to.deep.equal(key);
  });

  it('should update string key', async () => {
    const key = { key: 'test', value: 'v1' };
    await support.client.send(new CreateStringKeyCommand(key));

    const response = await support.client.send(new UpdateStringKeyCommand({ key: 'test', value: 'v2' }));

    expect(response).to.deep.equal({ key: 'test', value: 'v2' });
  });
});
