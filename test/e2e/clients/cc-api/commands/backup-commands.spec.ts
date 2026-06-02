import { describe, expect, it } from 'vitest';
import { ListBackupCommand } from '../../../../../src/clients/cc-api/commands/backup/list-backup-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { STATIC_MYSQL_ADDON_ID, e2eSupport } from '../e2e-support.js';

describe('backup commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should list backups without commands', async () => {
    const response = await support.client.send(new ListBackupCommand({ addonId: STATIC_MYSQL_ADDON_ID }));

    expect(response).toBeInstanceOf(Array);
    expect(response[0].backupId).toBeTypeOf('string');
    expect(response[0].entityId).toBeTypeOf('string');
    expect(response[0].status).toBeTypeOf('string');
    checkDateFormat(response[0].creationDate);
    checkDateFormat(response[0].expirationDate);
    expect(response[0].downloadUrl).toBeTypeOf('string');
    expect(response[0].commands).toBeUndefined();
  });

  it('should list backups with commands', async () => {
    const response = await support.client.send(
      new ListBackupCommand({ addonId: STATIC_MYSQL_ADDON_ID, withCommands: true }),
    );

    expect(response).toBeInstanceOf(Array);
    expect(response[0].backupId).toBeTypeOf('string');
    expect(response[0].entityId).toBeTypeOf('string');
    expect(response[0].status).toBeTypeOf('string');
    checkDateFormat(response[0].creationDate);
    checkDateFormat(response[0].expirationDate);
    expect(response[0].downloadUrl).toBeTypeOf('string');
    expect(response[0].commands.restoreCommand).toBeTypeOf('string');
    expect(response[0].commands.password).toBeTypeOf('string');
    expect(response[0].commands.deleteCommand).toBeUndefined();
  });
});
