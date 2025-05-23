import { CreateLogDrainCommand } from '../../../../../src/clients/api/commands/log-drain/create-log-drain-command.js';
import { DeleteLogDrainCommand } from '../../../../../src/clients/api/commands/log-drain/delete-log-drain-command.js';
import { ListLogDrainCommand } from '../../../../../src/clients/api/commands/log-drain/list-log-drain-command.js';
import { UpdateLogDrainCommand } from '../../../../../src/clients/api/commands/log-drain/update-log-drain-command.js';
import { getCcApiClient } from '../../../../lib/cc-api-client.js';

let currentApplicationId = 'app_b75977aa-563f-40fd-a592-224a5f6afbd6';
let currentAddonId = 'addon_5b4a7c43-4b84-45e6-837c-153308182bf1';

describe('log-drain-command', function () {
  this.timeout(10000);

  it('should cleanup', async () => {
    const drains = await getCcApiClient().send(new ListLogDrainCommand({ addonId: currentAddonId }));
    for (let { id } of drains) {
      await getCcApiClient().send(
        new DeleteLogDrainCommand({
          addonId: currentAddonId,
          drainId: id,
        }),
      );
    }
  });

  it('should work', async () => {
    console.log('list');
    console.log(await getCcApiClient().send(new ListLogDrainCommand({ addonId: currentAddonId })));
    console.log('----------------------------------------------------------------------------------------');
    console.log('----------------------------------------------------------------------------------------');
    console.log('create');
    const drain = await getCcApiClient().send(
      new CreateLogDrainCommand({
        addonId: currentAddonId,
        target: {
          type: 'HTTP',
          url: 'http://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );
    console.log(drain);
    console.log('----------------------------------------------------------------------------------------');
    console.log('----------------------------------------------------------------------------------------');
    console.log(await getCcApiClient().send(new ListLogDrainCommand({ addonId: currentAddonId })));
    console.log('----------------------------------------------------------------------------------------');
    console.log('----------------------------------------------------------------------------------------');
    console.log('update');
    console.log(
      await getCcApiClient().send(
        new UpdateLogDrainCommand({
          addonId: currentAddonId,
          drainId: drain.id,
          state: 'DISABLED',
        }),
      ),
    );
    console.log('----------------------------------------------------------------------------------------');
    console.log('----------------------------------------------------------------------------------------');
    console.log(await getCcApiClient().send(new ListLogDrainCommand({ addonId: currentAddonId })));
    console.log('----------------------------------------------------------------------------------------');
    console.log('----------------------------------------------------------------------------------------');
    console.log('update');
    console.log(
      await getCcApiClient().send(
        new UpdateLogDrainCommand({
          addonId: currentAddonId,
          drainId: drain.id,
          state: 'ENABLED',
        }),
      ),
    );
    console.log('----------------------------------------------------------------------------------------');
    console.log('----------------------------------------------------------------------------------------');
    console.log(await getCcApiClient().send(new ListLogDrainCommand({ addonId: currentAddonId })));
    console.log('----------------------------------------------------------------------------------------');
    console.log('----------------------------------------------------------------------------------------');
    console.log('delete');
    console.log(
      await getCcApiClient().send(
        new DeleteLogDrainCommand({
          addonId: currentAddonId,
          drainId: drain.id,
        }),
      ),
    );
    console.log('----------------------------------------------------------------------------------------');
    console.log('----------------------------------------------------------------------------------------');
    console.log(await getCcApiClient().send(new ListLogDrainCommand({ addonId: currentAddonId })));
  });
});
