import { expect } from 'chai';
import { GetGithubLinkTransactionIdCommand } from '../../../../../src/clients/api/commands/github/get-github-link-transaction-id-command.js';
import { GetGithubUsernameCommand } from '../../../../../src/clients/api/commands/github/get-github-username-command.js';
import { ListGithubApplicationCommand } from '../../../../../src/clients/api/commands/github/list-github-application-command.js';
import { getCcApiClient } from '../../../../lib/cc-api-client.js';

describe('github-command', function () {
  this.timeout(10000);

  describe('with unlinked account', function () {
    it('get transaction id should work', async () => {
      console.log(await getCcApiClient().send(new GetGithubLinkTransactionIdCommand()));
    });

    it('get username should throw error', async () => {
      await expectThrowsAsync(getCcApiClient().send(new GetGithubUsernameCommand()));
    });

    it('list app should throw error', async () => {
      await expectThrowsAsync(getCcApiClient().send(new ListGithubApplicationCommand()));
    });
  });

  describe('with linked account', function () {
    it('should work', async () => {
      console.log(await getCcApiClient({ auth: 'GITHUB' }).send(new GetGithubLinkTransactionIdCommand()));
      console.log(await getCcApiClient({ auth: 'GITHUB' }).send(new GetGithubUsernameCommand()));
      console.log(await getCcApiClient({ auth: 'GITHUB' }).send(new ListGithubApplicationCommand()));
    });
  });

  /**
   * @param {Promise<?>} promise
   * @returns {Promise<void>}
   */
  const expectThrowsAsync = async (promise) => {
    let error = null;
    try {
      await promise;
    } catch (err) {
      error = err;
    }
    expect(error).to.be.an('Error');
  };
});
