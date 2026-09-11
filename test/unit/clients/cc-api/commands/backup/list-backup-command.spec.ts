import { describe, expect, it } from 'vitest';
import { GetAddonCommand } from '../../../../../../src/clients/cc-api/commands/addon/get-addon-command.js';
import { ListBackupCommand } from '../../../../../../src/clients/cc-api/commands/backup/list-backup-command.js';
import type { ListBackupCommandInput } from '../../../../../../src/clients/cc-api/commands/backup/list-backup-command.types.js';
import type { CcApiComposer } from '../../../../../../src/clients/cc-api/types/cc-api.types.js';

const BACKUP = {
  backupId: 'backup_x',
  entityId: 'entity_x',
  status: 'COMPLETED',
  createdAt: '2026-01-01T00:00:00.000Z',
  downloadUrl: 'https://example.com/backup_x',
};

const ADDON = { id: 'addon_x', provider: { id: 'mysql-addon' } };

const ADDON_DETAILS = {
  id: 'addon_x',
  providerId: 'mysql-addon',
  host: 'mysql.example.com',
  port: 3306,
  user: 'u_x',
  password: 'secret',
  database: 'b_x',
};

/** The commands `compose()` sends, in order, for the given input. */
async function commandsSentFor(params: ListBackupCommandInput): Promise<Array<{ params: unknown }>> {
  const sent: Array<{ params: unknown }> = [];
  const responses: Array<unknown> = [[BACKUP], ADDON, ADDON_DETAILS];
  const composer = {
    send(command: { params: unknown }) {
      sent.push(command);
      return Promise.resolve(responses[sent.length - 1]);
    },
  } as unknown as CcApiComposer;

  await new ListBackupCommand(params).compose(params, composer);

  return sent;
}

describe('ListBackupCommand', () => {
  // the input carries an owner so the client can skip a lookup, and the add-on fetch must get it
  it('should pass the owner the caller gave down to the add-on fetch', async () => {
    const sent = await commandsSentFor({ ownerId: 'orga_x', addonId: 'addon_x', withCommands: true });

    expect(sent[1]).toBeInstanceOf(GetAddonCommand);
    expect(sent[1].params).toEqual({ ownerId: 'orga_x', addonId: 'addon_x' });
  });

  it('should invent no owner when the caller gave none', async () => {
    const sent = await commandsSentFor({ addonId: 'addon_x', withCommands: true });

    expect(sent[1]).toBeInstanceOf(GetAddonCommand);
    expect(sent[1].params).toEqual({ addonId: 'addon_x' });
  });
});
