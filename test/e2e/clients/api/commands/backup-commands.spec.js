import { expect } from 'chai';
import { ListBackupCommand } from '../../../../../src/clients/api/commands/backup/list-backup-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

// cannot be automatised because there is no API to create a backup
describe('backup commands', function () {
  this.timeout(10000);

  const support = e2eSupport({ auth: 'DEV' });

  it('should list backups', async () => {
    const response = await support.client.send(
      new ListBackupCommand({ addonId: 'addon_5b4a7c43-4b84-45e6-837c-153308182bf1' }),
    );

    expect(response).to.be.an('array');
    expect(response[0].backupId).to.be.a('string');
    expect(response[0].entityId).to.be.a('string');
    expect(response[0].status).to.be.a('string');
    expect(response[0].creationDate).to.equal(new Date(response[0].creationDate).toISOString());
    expect(response[0].deleteAt).to.equal(new Date(response[0].deleteAt).toISOString());
    expect(response[0].filename).to.be.a('string');
    expect(response[0].downloadUrl).to.be.a('string');
  });
});
