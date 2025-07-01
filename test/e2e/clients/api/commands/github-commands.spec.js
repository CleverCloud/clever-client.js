import { expect } from 'chai';
import { GetGithubLinkTransactionIdCommand } from '../../../../../src/clients/api/commands/github/get-github-link-transaction-id-command.js';
import { GetGithubUsernameCommand } from '../../../../../src/clients/api/commands/github/get-github-username-command.js';
import { ListGithubApplicationCommand } from '../../../../../src/clients/api/commands/github/list-github-application-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('github commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  describe('with unlinked account', function () {
    it('get transaction id should work', async () => {
      console.log(await support.getClient('GITHUB_UNLINKED').send(new GetGithubLinkTransactionIdCommand()));
    });

    it('get username should throw error', async () => {
      await expectThrowsAsync(support.getClient('GITHUB_UNLINKED').send(new GetGithubUsernameCommand()));
    });

    it('list app should throw error', async () => {
      await expectThrowsAsync(support.getClient('GITHUB_UNLINKED').send(new ListGithubApplicationCommand()));
    });
  });

  describe('with linked account', function () {
    it('should work', async () => {
      console.log(await support.getClient('GITHUB_LINKED').send(new GetGithubLinkTransactionIdCommand()));
      console.log(await support.getClient('GITHUB_LINKED').send(new GetGithubUsernameCommand()));
      console.log(await support.getClient('GITHUB_LINKED').send(new ListGithubApplicationCommand()));
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
