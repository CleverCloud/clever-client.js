import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetProductAddonCommand } from '../../../../../src/clients/cc-api/commands/product/get-product-addon-command.js';
import { GetProductAddonVersionsCommand } from '../../../../../src/clients/cc-api/commands/product/get-product-addon-versions-command.js';
import { GetProductElasticsearchInfoCommand } from '../../../../../src/clients/cc-api/commands/product/get-product-elasticsearch-info-command.js';
import { GetProductRuntimeCommand } from '../../../../../src/clients/cc-api/commands/product/get-product-runtime-command.js';
import { ListProductAddonCommand } from '../../../../../src/clients/cc-api/commands/product/list-product-addon-command.js';
import { ListProductRuntimeCommand } from '../../../../../src/clients/cc-api/commands/product/list-product-runtime-command.js';
import type {
  ElasticsearchServiceInfo,
  ProductAddon,
  ProductRuntime,
  ProductRuntimeFlavor,
} from '../../../../../src/clients/cc-api/commands/product/product.types.js';
import { expectToBeDefined } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('product commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  afterEach(async () => {});

  it('should list runtimes', async () => {
    const response = await support.client.send(new ListProductRuntimeCommand());

    expect(response).toBeInstanceOf(Array);
    checkProductRuntime(response[0]);
  });

  it('should get runtime', async () => {
    const runtimes = await support.client.send(new ListProductRuntimeCommand());

    const response = await support.client.send(
      new GetProductRuntimeCommand({ type: runtimes[0].type, version: runtimes[0].version }),
    );

    checkProductRuntime(response);
  });

  it('should list addons without versions', async () => {
    const response = await support.client.send(new ListProductAddonCommand({ withVersions: false }));

    expect(response).toBeInstanceOf(Array);
    checkAddon(response[0], false);
  });

  it('should list addons with versions', async () => {
    const response = await support.client.send(new ListProductAddonCommand({ withVersions: true }));

    expect(response).toBeInstanceOf(Array);
    checkAddon(response[0], true);
  });

  it('should get addon without versions', async () => {
    const response = await support.client.send(new GetProductAddonCommand({ id: 'mysql-addon', withVersions: false }));

    expectToBeDefined(response);
    checkAddon(response, false);
  });

  it('should get addon with versions', async () => {
    const response = await support.client.send(new GetProductAddonCommand({ id: 'mysql-addon', withVersions: true }));

    expectToBeDefined(response);
    checkAddon(response, false);
  });

  it('should get addon version', async () => {
    const response = await support.client.send(new GetProductAddonVersionsCommand({ id: 'mysql-addon' }));

    expect(response.clusters).toBeInstanceOf(Array);
    expect(response.dedicated).toBeTypeOf('object');
    expect(response.defaultDedicatedVersion).toBeTypeOf('string');
  });

  it('should get elasticsearch info', async () => {
    const response = await support.client.send(new GetProductElasticsearchInfoCommand());

    checkElasticsearchServiceInfo(response.services.apm);
    checkElasticsearchServiceInfo(response.services.kibana);
  });

  function checkProductRuntime(runtime: ProductRuntime) {
    expect(runtime.type).toBeTypeOf('string');
    expect(runtime.version).toBeTypeOf('string');
    expect(runtime.name).toBeTypeOf('string');
    expect(runtime.variant).toBeTypeOf('object');
    expect(runtime.variant.id).toBeTypeOf('string');
    expect(runtime.variant.slug).toBeTypeOf('string');
    expect(runtime.variant.name).toBeTypeOf('string');
    expect(runtime.variant.deployType).toBeTypeOf('string');
    expect(runtime.variant.logo).toBeTypeOf('string');
    expect(runtime.description).toBeTypeOf('string');
    expect(runtime.enabled).toBeTypeOf('boolean');
    expect(runtime.comingSoon).toBeTypeOf('boolean');
    expect(runtime.maxInstances).toBeTypeOf('number');
    expect(runtime.tags).toBeInstanceOf(Array);
    expect(runtime.deployments).toBeInstanceOf(Array);
    expect(runtime.flavors).toBeInstanceOf(Array);
    checkProductRuntimeFlavor(runtime.flavors[0]);
    checkProductRuntimeFlavor(runtime.defaultFlavor);
    checkProductRuntimeFlavor(runtime.buildFlavor);
  }

  function checkProductRuntimeFlavor(flavor: ProductRuntimeFlavor) {
    expect(flavor.name).toBeTypeOf('string');
    expect(flavor.mem).toBeTypeOf('number');
    expect(flavor.cpus).toBeTypeOf('number');
    expect(flavor.gpus).toBeTypeOf('number');
    expect(flavor.price).toBeTypeOf('number');
    expect(flavor.available).toBeTypeOf('boolean');
    expect(flavor.microservice).toBeTypeOf('boolean');
    expect(flavor.machineLearning).toBeTypeOf('boolean');
    expect(flavor.nice).toBeTypeOf('number');
    expect(flavor.priceId).toBeTypeOf('string');
    if (flavor.memory.unit != null) {
      expect(flavor.memory.unit).toBeTypeOf('string');
    }
    if (flavor.memory.value != null) {
      expect(flavor.memory.value).toBeTypeOf('number');
    }
    if (flavor.memory.formatted != null) {
      expect(flavor.memory.formatted).toBeTypeOf('string');
    }
    expect(flavor.cpuFactor).toBeTypeOf('number');
    expect(flavor.memFactor).toBeTypeOf('number');
  }

  function checkAddon(addon: ProductAddon, withVersion: boolean) {
    expect(addon.id).toBeTypeOf('string');
    expect(addon.name).toBeTypeOf('string');
    expect(addon.website).toBeTypeOf('string');
    expect(addon.supportEmail).toBeTypeOf('string');
    expect(addon.googlePlusName).toBeTypeOf('string');
    expect(addon.twitterName).toBeTypeOf('string');
    expect(addon.analyticsId).toBeTypeOf('string');
    expect(addon.shortDesc).toBeTypeOf('string');
    expect(addon.longDesc).toBeTypeOf('string');
    expect(addon.logoUrl).toBeTypeOf('string');
    expect(addon.status).toBeTypeOf('string');
    expect(addon.openInNewTab).toBeTypeOf('boolean');
    expect(addon.canUpgrade).toBeTypeOf('boolean');
    expect(addon.zones).toBeInstanceOf(Array);
    expect(addon.plans).toBeInstanceOf(Array);
    expect(addon.features).toBeInstanceOf(Array);

    if (withVersion) {
      expect(addon).toHaveProperty('versions');
    }
  }

  function checkElasticsearchServiceInfo(elasticsearchServiceInfo: ElasticsearchServiceInfo) {
    expect(elasticsearchServiceInfo.name).toBeTypeOf('string');
    expect(elasticsearchServiceInfo.mem).toBeTypeOf('number');
    expect(elasticsearchServiceInfo.cpus).toBeTypeOf('number');
    expect(elasticsearchServiceInfo.gpus).toBeTypeOf('number');
    expect(elasticsearchServiceInfo.price).toBeTypeOf('number');
    expect(elasticsearchServiceInfo.available).toBeTypeOf('boolean');
    expect(elasticsearchServiceInfo.microservice).toBeTypeOf('boolean');
    expect(elasticsearchServiceInfo.nice).toBeTypeOf('number');
    expect(elasticsearchServiceInfo.priceId).toBeTypeOf('string');
  }
});
