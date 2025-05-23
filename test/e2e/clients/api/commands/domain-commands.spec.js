import { CreateDomainCommand } from '../../../../../src/clients/api/commands/domain/create-domain-command.js';
import { DeleteDomainCommand } from '../../../../../src/clients/api/commands/domain/delete-domain-command.js';
import { ListDomainCommand } from '../../../../../src/clients/api/commands/domain/list-domain-command.js';
import { SetPrimaryDomainCommand } from '../../../../../src/clients/api/commands/domain/set-primary-domain-command.js';
import { UnsetPrimaryDomainCommand } from '../../../../../src/clients/api/commands/domain/unset-primary-domain-command.js';
import { getCcApiClient } from '../../../../lib/cc-api-client.js';

let currentApplicationId = 'app_d0969d3a-5317-4e62-91e3-7adfe66acfa4';

describe('list-domain-command', function () {
  this.timeout(10000);

  it('should list domains', async () => {
    let domains = await getCcApiClient().send(
      new ListDomainCommand({
        applicationId: currentApplicationId,
      }),
    );
    console.log(domains);

    const notPrimaryDomain = domains.find((domain) => domain.isPrimary === false);

    console.log('set primary domain');
    await getCcApiClient().send(
      new SetPrimaryDomainCommand({ applicationId: currentApplicationId, domain: notPrimaryDomain.domain }),
    );
    console.log(
      await getCcApiClient().send(
        new ListDomainCommand({
          applicationId: currentApplicationId,
        }),
      ),
    );

    console.log('unsetting primary domain');
    await getCcApiClient().send(new UnsetPrimaryDomainCommand({ applicationId: currentApplicationId }));

    console.log(
      await getCcApiClient().send(
        new ListDomainCommand({
          applicationId: currentApplicationId,
        }),
      ),
    );

    console.log('creating domain');
    await getCcApiClient().send(
      new CreateDomainCommand({ applicationId: currentApplicationId, domain: '*.example.com/coucou' }),
    );

    console.log(
      await getCcApiClient().send(
        new ListDomainCommand({
          applicationId: currentApplicationId,
        }),
      ),
    );

    console.log('deleting domain');
    await getCcApiClient().send(
      new DeleteDomainCommand({ applicationId: currentApplicationId, domain: '*.example.com/coucou' }),
    );

    console.log(
      await getCcApiClient().send(
        new ListDomainCommand({
          applicationId: currentApplicationId,
        }),
      ),
    );
  });
});
