import { describe, expect, it } from 'vitest';
import { GetGithubLinkTransactionIdCommand } from '../../../../../src/clients/cc-api/commands/github/get-github-link-transaction-id-command.js';
import { GetGithubUsernameCommand } from '../../../../../src/clients/cc-api/commands/github/get-github-username-command.js';
import { ListGithubApplicationCommand } from '../../../../../src/clients/cc-api/commands/github/list-github-application-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('github commands', function () {
  const support = e2eSupport();

  describe('with unlinked account', function () {
    it('should get transaction id', async () => {
      const response = await support
        .getClient({ user: 'test-user-without-github' })
        .send(new GetGithubLinkTransactionIdCommand());

      expect(response.transactionId).toBeTypeOf('string');
    });

    it('should get username', async () => {
      const response = await support
        .getClient({ user: 'test-user-without-github' })
        .send(new GetGithubUsernameCommand());

      expect(response).toBeNull();
    });

    it('list applications should be empty', async () => {
      const response = await support
        .getClient({ user: 'test-user-without-github' })
        .send(new ListGithubApplicationCommand());

      expect(response).toHaveLength(0);
    });
  });

  describe('with linked account', function () {
    it('should get transaction id', async () => {
      const response = await support
        .getClient({ user: 'test-user-without-github' })
        .send(new GetGithubLinkTransactionIdCommand());

      expect(response.transactionId).toBeTypeOf('string');
    });

    it('should get username', async () => {
      const response = await support.getClient({ user: 'test-user-with-github' }).send(new GetGithubUsernameCommand());

      expect(response).toBeTypeOf('string');
    });

    it('should get applications', async () => {
      const response = await support
        .getClient({ user: 'test-user-with-github' })
        .send(new ListGithubApplicationCommand());

      expect(response).toBeInstanceOf(Array);
      expect(response[0].id).toBeTypeOf('string');
      expect(response[0].owner).toBeTypeOf('string');
      expect(response[0].name).toBeTypeOf('string');
      expect(response[0]).toHaveProperty('description');
      expect(response[0].gitUrl).toBeTypeOf('string');
      expect(response[0].defaultBranch).toBeTypeOf('string');
      expect(response[0].private).toBeTypeOf('boolean');
    });
  });
});
