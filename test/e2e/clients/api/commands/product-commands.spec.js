import { GetProductAddonCommand } from '../../../../../src/clients/api/commands/product/get-product-addon-command.js';
import { GetProductAddonVersionsCommand } from '../../../../../src/clients/api/commands/product/get-product-addon-versions-command.js';
import { GetProductElasticsearchInfoCommand } from '../../../../../src/clients/api/commands/product/get-product-elasticsearch-info-command.js';
import { GetProductRuntimeCommand } from '../../../../../src/clients/api/commands/product/get-product-runtime-command.js';
import { ListProductAddonCommand } from '../../../../../src/clients/api/commands/product/list-product-addon-command.js';
import { ListProductRuntimeCommand } from '../../../../../src/clients/api/commands/product/list-product-runtime-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('product commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {});

  it('should list runtimes', async () => {
    const response = await support.client.send(new ListProductRuntimeCommand());

    console.log(JSON.stringify(response, null, 2));
  });

  it('should get runtime', async () => {
    const runtimes = await support.client.send(new ListProductRuntimeCommand());

    const response = await support.client.send(
      new GetProductRuntimeCommand({ type: runtimes[0].type, version: runtimes[0].version }),
    );
    console.log(JSON.stringify(response, null, 2));
  });

  it('should list addons without versions', async () => {
    const response = await support.client.send(new ListProductAddonCommand({ withVersions: false }));
    console.log(JSON.stringify(response, null, 2));
  });

  it('should list addons with versions', async () => {
    const response = await support.client.send(new ListProductAddonCommand({ withVersions: true }));
    console.log(JSON.stringify(response, null, 2));
  });

  it('should get addon without versions', async () => {
    const response = await support.client.send(new GetProductAddonCommand({ id: 'mysql-addon', withVersions: false }));
    console.log(JSON.stringify(response, null, 2));
  });

  it('should get addon with versions', async () => {
    const response = await support.client.send(new GetProductAddonCommand({ id: 'mysql-addon', withVersions: true }));
    console.log(JSON.stringify(response, null, 2));
  });

  it('should get addon version', async () => {
    const response = await support.client.send(new GetProductAddonVersionsCommand({ id: 'mysql-addon' }));
    console.log(JSON.stringify(response, null, 2));
  });

  it('should get elasticsearch info', async () => {
    const response = await support.client.send(new GetProductElasticsearchInfoCommand());
    console.log(JSON.stringify(response, null, 2));
  });
});
