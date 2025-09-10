import { expect } from 'chai';
import { ListBackupCommand } from '../../../../../src/clients/cc-api/commands/backup/list-backup-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { STATIC_MYSQL_ADDON_ID, e2eSupport } from '../e2e-support.js';

describe('backup commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should list backups without commands', async () => {
    const response = await support.client.send(new ListBackupCommand({ addonId: STATIC_MYSQL_ADDON_ID }));

    expect(response).to.be.an('array');
    expect(response[0].backupId).to.be.a('string');
    expect(response[0].entityId).to.be.a('string');
    expect(response[0].status).to.be.a('string');
    checkDateFormat(response[0].creationDate);
    checkDateFormat(response[0].expirationDate);
    expect(response[0].downloadUrl).to.be.a('string');
    expect(response[0].commands).to.be.undefined;
  });

  it('should list backups with commands', async () => {
    const response = await support.client.send(
      new ListBackupCommand({ addonId: STATIC_MYSQL_ADDON_ID, withCommands: true }),
    );

    expect(response).to.be.an('array');
    expect(response[0].backupId).to.be.a('string');
    expect(response[0].entityId).to.be.a('string');
    expect(response[0].status).to.be.a('string');
    checkDateFormat(response[0].creationDate);
    checkDateFormat(response[0].expirationDate);
    expect(response[0].downloadUrl).to.be.a('string');
    expect(response[0].commands.restoreCommand).to.be.a('string');
    expect(response[0].commands.password).to.be.a('string');
    expect(response[0].commands.deleteCommand).to.be.undefined;
  });
});
