import { expect } from 'chai';
import { CreateHashKeyCommand } from '../../../../../src/clients/redis-http/commands/hash-key/create-hash-key-command.js';
import { DeleteHashKeyElementCommand } from '../../../../../src/clients/redis-http/commands/hash-key/delete-hash-key-element-command.js';
import { ScanHashKeyCommand } from '../../../../../src/clients/redis-http/commands/hash-key/scan-hash-key-command.js';
import { SetHashKeyElementCommand } from '../../../../../src/clients/redis-http/commands/hash-key/set-hash-key-element-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('hash-key commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.cleanup();
  });

  it('should create hash key', async () => {
    const key = { key: 'test', elements: [{ field: 'f1', value: 'v1' }] };
    const response = await support.client.send(new CreateHashKeyCommand(key));

    expect(response).to.deep.equal(key);
  });

  it('should delete hash key element', async () => {
    const key = { key: 'test', elements: [{ field: 'f1', value: 'v1' }] };
    await support.client.send(new CreateHashKeyCommand(key));

    const response = await support.client.send(
      new DeleteHashKeyElementCommand({
        key: 'test',
        field: 'f1',
      }),
    );

    expect(response).to.deep.equal({ key: 'test', field: 'f1', deleted: true });
  });

  it('should scan hash key', async () => {
    const key = {
      key: 'test',
      elements: [
        { field: 'f1', value: 'v1' },
        { field: 'f2', value: 'v2' },
      ],
    };
    await support.client.send(new CreateHashKeyCommand(key));

    const response = await support.client.send(new ScanHashKeyCommand({ key: 'test' }));

    expect(response.key).to.equal('test');
    expect(response.cursor).to.be.a('number');
    expect(response.elements).to.deep.equalInAnyOrder(key.elements);
  });

  it('should set hash key element', async () => {
    const key = { key: 'test', elements: [{ field: 'f1', value: 'v1' }] };
    await support.client.send(new CreateHashKeyCommand(key));

    const response = await support.client.send(
      new SetHashKeyElementCommand({
        key: 'test',
        field: 'f1',
        value: 'v2',
      }),
    );

    expect(response).to.deep.equal({ key: 'test', field: 'f1', value: 'v2', added: false });
  });
});
