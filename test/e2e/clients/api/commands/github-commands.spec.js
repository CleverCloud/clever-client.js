import { expect } from 'chai';
import { GetGithubLinkTransactionIdCommand } from '../../../../../src/clients/api/commands/github/get-github-link-transaction-id-command.js';
import { GetGithubUsernameCommand } from '../../../../../src/clients/api/commands/github/get-github-username-command.js';
import { ListGithubApplicationCommand } from '../../../../../src/clients/api/commands/github/list-github-application-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('github commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  describe('with unlinked account', function () {
    it('should get transaction id', async () => {
      const response = await support.getClient('GITHUB_UNLINKED').send(new GetGithubLinkTransactionIdCommand());

      expect(response.transactionId).to.be.a('string');
    });

    it('should get username', async () => {
      const response = await support.getClient('GITHUB_UNLINKED').send(new GetGithubUsernameCommand());

      expect(response).to.be.null;
    });

    it('list applications should throw error', async () => {
      const response = await support.getClient('GITHUB_UNLINKED').send(new ListGithubApplicationCommand());

      expect(response).to.be.null;
    });
  });

  describe('with linked account', function () {
    it('should get transaction id', async () => {
      const response = await support.getClient('GITHUB_LINKED').send(new GetGithubLinkTransactionIdCommand());

      expect(response.transactionId).to.be.a('string');
    });

    it('should get username', async () => {
      const response = await support.getClient('GITHUB_LINKED').send(new GetGithubUsernameCommand());

      expect(response).to.be.a('string');
    });

    it('should get applications', async () => {
      const response = await support.getClient('GITHUB_LINKED').send(new ListGithubApplicationCommand());

      expect(response).to.be.an('array');
      expect(response[0].id).to.be.a('string');
      expect(response[0].owner).to.be.a('string');
      expect(response[0].name).to.be.a('string');
      expect(response[0]).to.ownProperty('description');
      expect(response[0].gitUrl).to.be.a('string');
      expect(response[0].defaultBranch).to.be.a('string');
      expect(response[0].private).to.be.a('boolean');
    });
  });
});
