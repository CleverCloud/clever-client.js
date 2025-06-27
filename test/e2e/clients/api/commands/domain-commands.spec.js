import { CreateDomainCommand } from '../../../../../src/clients/api/commands/domain/create-domain-command.js';
import { DeleteDomainCommand } from '../../../../../src/clients/api/commands/domain/delete-domain-command.js';
import { ListDomainCommand } from '../../../../../src/clients/api/commands/domain/list-domain-command.js';
import { SetPrimaryDomainCommand } from '../../../../../src/clients/api/commands/domain/set-primary-domain-command.js';
import { UnsetPrimaryDomainCommand } from '../../../../../src/clients/api/commands/domain/unset-primary-domain-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('list-domain-command', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteApplications();
  });

  it('should list domains', async () => {
    // todo: write assertions and split into multiple tests ?

    const application = await support.createTestApplication();

    let domains = await support.client.send(
      new ListDomainCommand({
        applicationId: application.id,
      }),
    );
    console.log(domains);

    const notPrimaryDomain = domains.find((domain) => domain.isPrimary === false);

    console.log('set primary domain');
    await support.client.send(
      new SetPrimaryDomainCommand({ applicationId: application.id, domain: notPrimaryDomain.domain }),
    );
    console.log(
      await support.client.send(
        new ListDomainCommand({
          applicationId: application.id,
        }),
      ),
    );

    console.log('unsetting primary domain');
    await support.client.send(new UnsetPrimaryDomainCommand({ applicationId: application.id }));

    console.log(
      await support.client.send(
        new ListDomainCommand({
          applicationId: application.id,
        }),
      ),
    );

    console.log('creating domain');
    await support.client.send(
      new CreateDomainCommand({ applicationId: application.id, domain: '*.example.com/coucou' }),
    );

    console.log(
      await support.client.send(
        new ListDomainCommand({
          applicationId: application.id,
        }),
      ),
    );

    console.log('deleting domain');
    await support.client.send(
      new DeleteDomainCommand({ applicationId: application.id, domain: '*.example.com/coucou' }),
    );

    console.log(
      await support.client.send(
        new ListDomainCommand({
          applicationId: application.id,
        }),
      ),
    );
  });
});
