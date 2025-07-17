import { expect } from 'chai';
import { ListBackupCommand } from '../../../../../src/clients/cc-api/commands/backup/list-backup-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { STATIC_ADDON_ID, e2eSupport } from '../e2e-support.js';

describe('backup commands', function () {
  this.timeout(10000);

  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should list backups', async () => {
    const response = await support.client.send(new ListBackupCommand({ addonId: STATIC_ADDON_ID }));

    expect(response).to.be.an('array');
    expect(response[0].backupId).to.be.a('string');
    expect(response[0].entityId).to.be.a('string');
    expect(response[0].status).to.be.a('string');
    checkDateFormat(response[0].creationDate);
    checkDateFormat(response[0].deleteAt);
    expect(response[0].filename).to.be.a('string');
    expect(response[0].downloadUrl).to.be.a('string');
  });
});
