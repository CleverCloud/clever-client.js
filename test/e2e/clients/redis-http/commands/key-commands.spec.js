import { expect } from 'chai';
import { CreateHashKeyCommand } from '../../../../../src/clients/redis-http/commands/hash-key/create-hash-key-command.js';
import { DeleteKeyCommand } from '../../../../../src/clients/redis-http/commands/key/delete-key-command.js';
import { ScanKeyCommand } from '../../../../../src/clients/redis-http/commands/key/scan-key-command.js';
import { CreateListKeyCommand } from '../../../../../src/clients/redis-http/commands/list-key/create-list-key-command.js';
import { CreateSetKeyCommand } from '../../../../../src/clients/redis-http/commands/set-key/create-set-key-command.js';
import { CreateStringKeyCommand } from '../../../../../src/clients/redis-http/commands/string-key/create-string-key-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('key commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.cleanup();
  });

  it('should delete key', async () => {
    const key = { key: 'test', elements: [{ field: 'f1', value: 'v1' }] };
    await support.client.send(new CreateHashKeyCommand(key));

    const response = await support.client.send(new DeleteKeyCommand({ key: 'test' }));

    expect(response).to.deep.equal({ key: 'test', deleted: true });
  });

  it('should scan keys', async () => {
    const key1 = { key: 'k1', elements: [{ field: 'f1', value: 'v1' }] };
    const key2 = { key: 'k2', elements: ['v1'] };
    const key3 = { key: 'k3', elements: ['v1'] };
    const key4 = { key: 'k4', value: 'v1' };
    await support.client.send(new CreateHashKeyCommand(key1));
    await support.client.send(new CreateListKeyCommand(key2));
    await support.client.send(new CreateSetKeyCommand(key3));
    await support.client.send(new CreateStringKeyCommand(key4));

    const response = await support.client.send(new ScanKeyCommand());

    expect(response.cursor).to.be.a('number');
    expect(response.total).to.equal(4);
    expect(response.keys).to.deep.equalInAnyOrder([
      { name: 'k1', type: 'hash' },
      { name: 'k2', type: 'list' },
      { name: 'k3', type: 'set' },
      { name: 'k4', type: 'string' },
    ]);
  });

  it('should scan keys with type filter', async () => {
    const key1 = { key: 'k1', elements: [{ field: 'f1', value: 'v1' }] };
    const key2 = { key: 'k2', elements: ['v1'] };
    const key3 = { key: 'k3', elements: ['v1'] };
    const key4 = { key: 'k4', value: 'v1' };
    await support.client.send(new CreateHashKeyCommand(key1));
    await support.client.send(new CreateListKeyCommand(key2));
    await support.client.send(new CreateSetKeyCommand(key3));
    await support.client.send(new CreateStringKeyCommand(key4));

    const response = await support.client.send(new ScanKeyCommand({ type: 'string' }));

    expect(response.cursor).to.be.a('number');
    expect(response.total).to.equal(4);
    expect(response.keys).to.deep.equalInAnyOrder([{ name: 'k4', type: 'string' }]);
  });
});
