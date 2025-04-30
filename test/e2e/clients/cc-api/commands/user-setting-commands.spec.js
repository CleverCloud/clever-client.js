import { expect } from 'chai';
import { DeleteUserSettingCommand } from '../../../../../src/clients/cc-api/commands/user-setting/delete-user-setting-command.js';
import { GetUserSettingCommand } from '../../../../../src/clients/cc-api/commands/user-setting/get-user-setting-command.js';
import { SetUserSettingCommand } from '../../../../../src/clients/cc-api/commands/user-setting/set-user-setting-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('user setting commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.client.send(
      new DeleteUserSettingCommand({
        env: 'test-e2e',
        name: 'hello',
      }),
    );
  });

  it('should set setting', async () => {
    const response = await support.client.send(
      new SetUserSettingCommand({
        env: 'test-e2e',
        name: 'hello',
        value: 'world',
      }),
    );

    expect(response).to.be.null;
  });

  it('should get user setting', async () => {
    await support.client.send(
      new SetUserSettingCommand({
        env: 'test-e2e',
        name: 'hello',
        value: 'world',
      }),
    );

    const response = await support.client.send(
      new GetUserSettingCommand({
        env: 'test-e2e',
        name: 'hello',
      }),
    );

    expect(response).to.equal('world');
  });

  it('should get user setting null', async () => {
    const response = await support.client.send(
      new GetUserSettingCommand({
        env: 'test-e2e',
        name: 'hello',
      }),
    );

    expect(response).to.be.null;
  });

  it('should delete user setting', async () => {
    await support.client.send(
      new SetUserSettingCommand({
        env: 'test-e2e',
        name: 'hello',
        value: 'world',
      }),
    );

    const response = await support.client.send(
      new DeleteUserSettingCommand({
        env: 'test-e2e',
        name: 'hello',
      }),
    );

    expect(response).to.be.null;
  });

  it('should delete user setting when not exist', async () => {
    const response = await support.client.send(
      new DeleteUserSettingCommand({
        env: 'test-e2e',
        name: 'hello',
      }),
    );

    expect(response).to.be.null;
  });
});
