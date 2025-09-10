import { expect } from 'chai';
import { AddListKeyElementCommand } from '../../../../../src/clients/redis-http/commands/list-key/add-list-key-element-command.js';
import { CreateListKeyCommand } from '../../../../../src/clients/redis-http/commands/list-key/create-list-key-command.js';
import { GetListKeyElementCommand } from '../../../../../src/clients/redis-http/commands/list-key/get-list-key-element-command.js';
import { ScanListKeyCommand } from '../../../../../src/clients/redis-http/commands/list-key/scan-list-key-command.js';
import { UpdateListKeyElementCommand } from '../../../../../src/clients/redis-http/commands/list-key/update-list-key-element-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('hash-key commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.cleanup();
  });

  it('should add list key element', async () => {
    const key = { key: 'test', elements: ['v1'] };
    await support.client.send(new CreateListKeyCommand(key));

    const response = await support.client.send(
      new AddListKeyElementCommand({ key: 'test', value: 'v2', position: 'head' }),
    );

    expect(response).to.deep.equal({ key: 'test', value: 'v2', index: 0 });
  });

  it('should create list key', async () => {
    const key = { key: 'test', elements: ['v1'] };
    const response = await support.client.send(new CreateListKeyCommand(key));

    expect(response).to.deep.equal(key);
  });

  it('should get list key element', async () => {
    const key = { key: 'test', elements: ['v1', 'v2', 'v3'] };
    await support.client.send(new CreateListKeyCommand(key));

    const response = await support.client.send(new GetListKeyElementCommand({ key: 'test', index: 1 }));

    expect(response).to.deep.equal({ key: 'test', value: 'v2', index: 1 });
  });

  it('should scan list key', async () => {
    const key = { key: 'test', elements: ['v1', 'v2'] };
    await support.client.send(new CreateListKeyCommand(key));

    const response = await support.client.send(new ScanListKeyCommand({ key: 'test' }));

    expect(response.key).to.equal('test');
    expect(response.cursor).to.be.a('number');
    expect(response.elements).to.deep.equalInAnyOrder([
      { index: 0, value: 'v1' },
      { index: 1, value: 'v2' },
    ]);
  });

  it('should update list key element', async () => {
    const key = { key: 'test', elements: ['v1'] };
    await support.client.send(new CreateListKeyCommand(key));

    const response = await support.client.send(
      new UpdateListKeyElementCommand({
        key: 'test',
        index: 0,
        value: 'v2',
      }),
    );

    expect(response).to.deep.equal({ key: 'test', index: 0, value: 'v2' });
  });
});
