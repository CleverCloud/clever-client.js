import { ListBackupCommand } from '../../../../../src/clients/api/commands/backup/list-backup-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe.skip('backup-command', function () {
  this.timeout(10000);
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await Promise.all([support.deleteApplications(), support.deleteAddons()]);
  });

  it('should list backups', async () => {
    const backups = await support.client.send(
      new ListBackupCommand({
        // ownerId: 'orga_540caeb6-521c-4a19-a955-efe6da35d142',
        // addonId: 'mysql_37057892-2186-4a44-8e43-d8095278e52a',
        addonId: 'addon_ea755f52-2385-4167-acb0-7abea24004e1',
      }),
    );

    console.log(backups);
  });
});
