/**
 * @import  { ProductRuntime, ProductRuntimeFlavor, ProductAddon, ElasticsearchServiceInfo } from '../../../../../src/clients/cc-api/commands/product/product.types.js';
 */
import { expect } from 'chai';
import { GetProductAddonCommand } from '../../../../../src/clients/cc-api/commands/product/get-product-addon-command.js';
import { GetProductAddonVersionsCommand } from '../../../../../src/clients/cc-api/commands/product/get-product-addon-versions-command.js';
import { GetProductElasticsearchInfoCommand } from '../../../../../src/clients/cc-api/commands/product/get-product-elasticsearch-info-command.js';
import { GetProductRuntimeCommand } from '../../../../../src/clients/cc-api/commands/product/get-product-runtime-command.js';
import { ListProductAddonCommand } from '../../../../../src/clients/cc-api/commands/product/list-product-addon-command.js';
import { ListProductRuntimeCommand } from '../../../../../src/clients/cc-api/commands/product/list-product-runtime-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('product commands', function () {
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

    expect(response).to.be.an('array');
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

    expect(response).to.be.an('array');
    checkAddon(response[0], false);
  });

  it('should list addons with versions', async () => {
    const response = await support.client.send(new ListProductAddonCommand({ withVersions: true }));

    expect(response).to.be.an('array');
    checkAddon(response[0], true);
  });

  it('should get addon without versions', async () => {
    const response = await support.client.send(new GetProductAddonCommand({ id: 'mysql-addon', withVersions: false }));

    checkAddon(response, false);
  });

  it('should get addon with versions', async () => {
    const response = await support.client.send(new GetProductAddonCommand({ id: 'mysql-addon', withVersions: true }));

    checkAddon(response, false);
  });

  it('should get addon version', async () => {
    const response = await support.client.send(new GetProductAddonVersionsCommand({ id: 'mysql-addon' }));

    expect(response.clusters).to.be.an('array');
    expect(response.dedicated).to.be.an('object');
    expect(response.defaultDedicatedVersion).to.be.a('string');
  });

  it('should get elasticsearch info', async () => {
    const response = await support.client.send(new GetProductElasticsearchInfoCommand());

    checkElasticsearchServiceInfo(response.services.apm);
    checkElasticsearchServiceInfo(response.services.kibana);
  });

  /**
   * @param {ProductRuntime} runtime
   */
  function checkProductRuntime(runtime) {
    expect(runtime.type).to.be.a('string');
    expect(runtime.version).to.be.a('string');
    expect(runtime.name).to.be.a('string');
    expect(runtime.variant).to.be.an('object');
    expect(runtime.variant.id).to.be.a('string');
    expect(runtime.variant.slug).to.be.a('string');
    expect(runtime.variant.name).to.be.a('string');
    expect(runtime.variant.deployType).to.be.a('string');
    expect(runtime.variant.logo).to.be.a('string');
    expect(runtime.description).to.be.a('string');
    expect(runtime.enabled).to.be.a('boolean');
    expect(runtime.comingSoon).to.be.a('boolean');
    expect(runtime.maxInstances).to.be.a('number');
    expect(runtime.tags).to.be.an('array');
    expect(runtime.deployments).to.be.an('array');
    expect(runtime.flavors).to.be.an('array');
    checkProductRuntimeFlavor(runtime.flavors[0]);
    checkProductRuntimeFlavor(runtime.defaultFlavor);
    checkProductRuntimeFlavor(runtime.buildFlavor);
  }

  /**
   * @param {ProductRuntimeFlavor} flavor
   */
  function checkProductRuntimeFlavor(flavor) {
    expect(flavor.name).to.be.a('string');
    expect(flavor.mem).to.be.a('number');
    expect(flavor.cpus).to.be.a('number');
    expect(flavor.gpus).to.be.a('number');
    expect(flavor.price).to.be.a('number');
    expect(flavor.available).to.be.a('boolean');
    expect(flavor.microservice).to.be.a('boolean');
    expect(flavor.machineLearning).to.be.a('boolean');
    expect(flavor.nice).to.be.a('number');
    expect(flavor.priceId).to.be.a('string');
    if (flavor.memory.unit != null) {
      expect(flavor.memory.unit).to.be.a('string');
    }
    if (flavor.memory.value != null) {
      expect(flavor.memory.value).to.be.a('number');
    }
    if (flavor.memory.formatted != null) {
      expect(flavor.memory.formatted).to.be.a('string');
    }
    expect(flavor.cpuFactor).to.be.a('number');
    expect(flavor.memFactor).to.be.a('number');
  }

  /**
   * @param {ProductAddon} addon
   * @param {boolean} withVersion
   */
  function checkAddon(addon, withVersion) {
    expect(addon.id).to.be.a('string');
    expect(addon.name).to.be.a('string');
    expect(addon.website).to.be.a('string');
    expect(addon.supportEmail).to.be.a('string');
    expect(addon.googlePlusName).to.be.a('string');
    expect(addon.twitterName).to.be.a('string');
    expect(addon.analyticsId).to.be.a('string');
    expect(addon.shortDesc).to.be.a('string');
    expect(addon.longDesc).to.be.a('string');
    expect(addon.logoUrl).to.be.a('string');
    expect(addon.status).to.be.a('string');
    expect(addon.openInNewTab).to.be.a('boolean');
    expect(addon.canUpgrade).to.be.a('boolean');
    expect(addon.zones).to.be.an('array');
    expect(addon.plans).to.be.a('array');
    expect(addon.features).to.be.a('array');

    if (withVersion) {
      expect(addon).to.have.property('versions');
    }
  }

  /**
   *
   * @param {ElasticsearchServiceInfo} elasticsearchServiceInfo
   */
  function checkElasticsearchServiceInfo(elasticsearchServiceInfo) {
    expect(elasticsearchServiceInfo.name).to.be.a('string');
    expect(elasticsearchServiceInfo.mem).to.be.a('number');
    expect(elasticsearchServiceInfo.cpus).to.be.a('number');
    expect(elasticsearchServiceInfo.gpus).to.be.a('number');
    expect(elasticsearchServiceInfo.price).to.be.a('number');
    expect(elasticsearchServiceInfo.available).to.be.a('boolean');
    expect(elasticsearchServiceInfo.microservice).to.be.a('boolean');
    expect(elasticsearchServiceInfo.nice).to.be.a('number');
    expect(elasticsearchServiceInfo.priceId).to.be.a('string');
  }
});
