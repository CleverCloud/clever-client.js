import { ListBackupCommand } from '../../../../../src/clients/api/commands/backup/list-backup-command.js';
import { getCcApiClient } from '../../../../lib/cc-api-client.js';

describe('backup-command', function () {
  this.timeout(10000);

  it('should list backups', async () => {
    const backups = await getCcApiClient().send(
      new ListBackupCommand({
        // ownerId: 'orga_540caeb6-521c-4a19-a955-efe6da35d142',
        // addonId: 'mysql_37057892-2186-4a44-8e43-d8095278e52a',
        addonId: 'addon_ea755f52-2385-4167-acb0-7abea24004e1',
      }),
    );

    console.log(backups);
  });
});
