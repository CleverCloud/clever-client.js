/**
 * @import { CreateOrganisationCommandInput } from '../../../../src/clients/cc-api/commands/organisation/create-organisation-command.types.js'
 * @import { Organisation } from '../../../../src/clients/cc-api/commands/organisation/organisation.types.js'
 * @import { CreateAddonCommandInput } from '../../../../src/clients/cc-api/commands/addon/create-addon-command.types.js'
 * @import { Addon } from '../../../../src/clients/cc-api/commands/addon/addon.types.js'
 * @import { CcApiAuth } from '../../../../src/clients/cc-api/types/cc-api.types.js'
 * @import { E2eUserName, E2eUser } from '../../../lib/e2e.types.js'
 */
import { use } from 'chai';
import { CcApiClient } from '../../../../src/clients/cc-api/cc-api-client.js';
import { CreateAddonCommand } from '../../../../src/clients/cc-api/commands/addon/create-addon-command.js';
import { DeleteAddonCommand } from '../../../../src/clients/cc-api/commands/addon/delete-addon-command.js';
import { GetAddonCommand } from '../../../../src/clients/cc-api/commands/addon/get-addon-command.js';
import { CreateApplicationCommand } from '../../../../src/clients/cc-api/commands/application/create-application-command.js';
import { DeleteApplicationCommand } from '../../../../src/clients/cc-api/commands/application/delete-application-command.js';
import { GetApplicationCommand } from '../../../../src/clients/cc-api/commands/application/get-application-command.js';
import { CreateNetworkGroupCommand } from '../../../../src/clients/cc-api/commands/network-group/create-network-group-command.js';
import { DeleteNetworkGroupCommand } from '../../../../src/clients/cc-api/commands/network-group/delete-network-group-command.js';
import { GetNetworkGroupCommand } from '../../../../src/clients/cc-api/commands/network-group/get-network-group-command.js';
import { CreateOauthConsumerCommand } from '../../../../src/clients/cc-api/commands/oauth-consumer/create-oauth-consumer-command.js';
import { DeleteOauthConsumerCommand } from '../../../../src/clients/cc-api/commands/oauth-consumer/delete-oauth-consumer-command.js';
import { GetOauthConsumerCommand } from '../../../../src/clients/cc-api/commands/oauth-consumer/get-oauth-consumer-command.js';
import { CreateOrganisationCommand } from '../../../../src/clients/cc-api/commands/organisation/create-organisation-command.js';
import { DeleteOrganisationCommand } from '../../../../src/clients/cc-api/commands/organisation/delete-organisation-command.js';
import { GetOrganisationCommand } from '../../../../src/clients/cc-api/commands/organisation/get-organisation-command.js';
import { GetProfileCommand } from '../../../../src/clients/cc-api/commands/profile/get-profile-command.js';
import { merge } from '../../../../src/lib/utils.js';
import { deepEqualInAnyOrder } from '../../../lib/deep-equal-in-any-order/deep-equal-in-any-order.js';
import { getE2eUser } from '../../../lib/e2e-test-users.js';

/**
 * @typedef Auth
 * @type {'api-token'|'oauth-v1'}
 */

const IS_NODE = globalThis.process != null;

/** @type {E2eUserName} */
const DEFAULT_USER = 'test-user-with-github';
/** @type {Auth} */
const DEFAULT_AUTH = 'api-token';
const USE_LOCAL_API_BRIDGE = false;

use(deepEqualInAnyOrder);

// todo: get all that from env. (and inject them nicely for browser test)
export const STATIC_MYSQL_ADDON_ID = 'addon_2066c7dd-5891-420a-ae3c-2334405c3bf1';
export const STATIC_INVOICE_ID = 'F20250718-021327';
export const STATIC_ORGANISATION_ID = 'orga_3659ccc6-1b06-4393-83d6-52dc3d72416d';

/**
 * @param {{user?: E2eUserName, auth?: Auth, debug?: boolean }} [config]
 */
export function e2eSupport(config) {
  const conf = merge({ user: DEFAULT_USER, auth: DEFAULT_AUTH, debug: false }, config);
  const e2eUser = getE2eUser(conf.user);
  /** @type {CcApiClient} */
  let client;

  /** @type {string} */
  let organisationId;
  /** @type {string} */
  let userId;
  /** @type {Array<{type: 'application'|'addon'|'ng'|'consumer'|'organisation', id: string}>} */
  let cleanupTasks = [];

  return {
    isNode: IS_NODE,
    /**
     * @param {object} _
     * @param {E2eUserName} [_.user]
     * @param {Auth} [_.auth]
     * @returns {CcApiClient}
     */
    getClient({ user, auth }) {
      return createCcApiClient(getE2eUser(user ?? DEFAULT_USER), auth ?? DEFAULT_AUTH, conf.debug);
    },
    get client() {
      if (client == null) {
        client = createCcApiClient(e2eUser, conf.auth, conf.debug);
      }
      return client;
    },
    get email() {
      return e2eUser.email;
    },
    get password() {
      return e2eUser.password;
    },
    get newTemporaryPassword() {
      return e2eUser.newTemporaryPassword;
    },
    get userId() {
      if (userId == null) {
        throw new Error('userId not set. Run prepare() first.');
      }
      return userId;
    },
    get organisationId() {
      if (organisationId == null) {
        throw new Error('organisationId not set. Run prepare() first.');
      }
      return organisationId;
    },
    async prepare() {
      // const organisation = await client.send(
      //   new CreateOrganisationCommand({
      //     // todo: add test run id to make the link with the GitHub action
      //     name: 'test organisation',
      //     description: 'used for clever-client.js e2e tests',
      //     address: 'test address',
      //     city: 'Nantes',
      //     zipcode: '44000',
      //     customerFullName: 'Clever Cloud',
      //     country: 'FR',
      //   }),
      // );
      // organisationId = organisation.id;
      // return organisationId;

      // for now we use personal orga
      const self = await this.client.send(new GetProfileCommand());
      organisationId = self.id;
      userId = self.id;
    },
    async cleanup() {
      await Promise.all([
        this.deleteOrganisations(),
        this.deleteApplications(),
        this.deleteAddons(),
        this.deleteConsumers(),
        this.deleteAddonProviders(),
        this.deleteNetworkGroups(),
      ]);
      // await client.send(new DeleteOrganisationCommand({ organisationId }));
    },
    async deleteOrganisations() {
      const organisations = cleanupTasks.filter((task) => task.type === 'organisation');
      await Promise.all(
        organisations.map((organisation) =>
          this.client
            .send(new GetOrganisationCommand({ organisationId: organisation.id }))
            .then((a) => a && this.client.send(new DeleteOrganisationCommand({ organisationId: organisation.id }))),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'organisation');
    },
    async deleteApplications() {
      // const applications = await this.client.send(new ListApplicationCommand({ ownerId: organisationId }));

      const applications = cleanupTasks.filter((task) => task.type === 'application');
      await Promise.all(
        applications.map((application) =>
          this.client
            .send(
              new GetApplicationCommand({
                ownerId: organisationId,
                applicationId: application.id,
                withBranches: false,
              }),
            )
            .then(
              (a) =>
                a &&
                this.client.send(
                  new DeleteApplicationCommand({ ownerId: organisationId, applicationId: application.id }),
                ),
            ),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'application');
    },
    async deleteAddons() {
      // const addons = await this.client.send(new ListAddonCommand({ ownerId: organisationId }));

      const addons = cleanupTasks.filter((task) => task.type === 'addon');
      await Promise.all(
        addons.map((addon) =>
          this.client
            .send(new GetAddonCommand({ ownerId: organisationId, addonId: addon.id }))
            .then((a) => a && this.client.send(new DeleteAddonCommand({ ownerId: organisationId, addonId: addon.id }))),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'addon');
    },
    async deleteNetworkGroups() {
      // const networkGroups = await this.client.send(new ListNetworkGroupCommand({ ownerId: organisationId }));

      const networkGroups = cleanupTasks.filter((task) => task.type === 'ng');
      await Promise.all(
        networkGroups.map((ng) =>
          this.client
            .send(new GetNetworkGroupCommand({ ownerId: organisationId, networkGroupId: ng.id }))
            .then(
              (a) =>
                a &&
                this.client.send(new DeleteNetworkGroupCommand({ ownerId: organisationId, networkGroupId: ng.id })),
            ),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'ng');
    },
    async deleteConsumers() {
      // const consumers = await this.client.send(new ListOauthConsumerCommand({ ownerId: organisationId }));

      const consumers = cleanupTasks.filter((task) => task.type === 'consumer');
      await Promise.all(
        consumers.map((consumer) =>
          this.client
            .send(
              new GetOauthConsumerCommand({
                ownerId: organisationId,
                oauthConsumerKey: consumer.id,
                withSecret: false,
              }),
            )
            .then(
              (a) =>
                a &&
                this.client.send(
                  new DeleteOauthConsumerCommand({ ownerId: organisationId, oauthConsumerKey: consumer.id }),
                ),
            ),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'consumer');
    },
    async deleteAddonProviders() {},
    /**
     * @param {CreateOrganisationCommandInput} [organisation]
     * @returns {Promise<Organisation>}
     */
    async createTestOrganisation(organisation) {
      const createdOrganisation = await this.client.send(
        new CreateOrganisationCommand(
          organisation ?? {
            name: 'name',
            description: 'description',
            address: 'address',
            city: 'city',
            zipcode: 'zipcode',
            customerFullName: 'customerFullName',
            country: 'FR',
          },
        ),
      );
      cleanupTasks.push({ type: 'organisation', id: createdOrganisation.id });
      return createdOrganisation;
    },
    async createTestApplication(name = 'test-application', ownerId = organisationId) {
      const application = await this.client.send(
        new CreateApplicationCommand({
          ownerId,
          name,
          zone: 'par',
          minInstances: 1,
          maxInstances: 1,
          minFlavor: 'xs',
          maxFlavor: 'xs',
          buildFlavor: 's',
          instance: { slug: 'node' },
          deploy: 'git',
          branch: 'master',
          oauthApp: {
            type: 'github',
            id: '991317993',
          },
          environment: [
            { name: 'ENV_VAR_1', value: 'value1' },
            { name: 'ENV_VAR_2', value: 'value2' },
          ],
        }),
      );

      cleanupTasks.push({ type: 'application', id: application.id });

      return application;
    },
    /**
     * @param {Partial<CreateAddonCommandInput>} [addon]
     * @returns {Promise<Addon>}
     */
    async createTestAddon(addon) {
      let createdAddon = await this.client.send(
        new CreateAddonCommand(
          addon
            ? {
                ...{
                  ownerId: organisationId,
                  name: 'test-addon',
                  providerId: 'config-provider',
                  planId: 'plan_5d8e9596-dd73-4b73-84d9-e165372c5324',
                  zone: 'par',
                  options: {},
                },
                ...addon,
              }
            : {
                ownerId: organisationId,
                name: 'test-addon',
                providerId: 'config-provider',
                planId: 'plan_5d8e9596-dd73-4b73-84d9-e165372c5324',
                zone: 'par',
                options: {},
              },
        ),
      );
      cleanupTasks.push({ type: 'addon', id: createdAddon.id });
      return createdAddon;
    },
    /**
     * @param {string} [memberId]
     * @param {string} [label]
     */
    async createNetworkGroup(memberId, label) {
      const networkGroup = await this.client.send(
        new CreateNetworkGroupCommand({
          ownerId: organisationId,
          label,
          members:
            memberId != null
              ? [
                  {
                    id: memberId,
                    label: 'my member',
                  },
                ]
              : [],
        }),
      );
      cleanupTasks.push({ type: 'ng', id: networkGroup.id });
      return networkGroup;
    },
    async createTestOauthConsumer() {
      const consumer = await this.client.send(
        new CreateOauthConsumerCommand({
          ownerId: organisationId,
          name: 'test-consumer',
          description: 'test consumer description',
          url: 'https://example.com',
          picture: 'https://example.com',
          baseUrl: 'https://example.com',
          rights: {
            accessOrganisations: true,
            accessOrganisationsBills: false,
            accessOrganisationsCreditCount: true,
            accessOrganisationsConsumptionStatistics: false,
            accessPersonalInformation: true,
            manageOrganisations: true,
            manageOrganisationsServices: true,
            manageOrganisationsApplications: false,
            manageOrganisationsMembers: true,
            managePersonalInformation: false,
            manageSshKeys: true,
          },
        }),
      );
      cleanupTasks.push({ type: 'consumer', id: consumer.key });
      return consumer;
    },
  };
}

/**
 * @param {E2eUser} user
 * @param {Auth} auth
 * @param {boolean} debug
 * @returns {CcApiClient}
 */
function createCcApiClient(user, auth, debug) {
  const defaultRequestConfig = { debug };

  if (USE_LOCAL_API_BRIDGE && auth === 'oauth-v1') {
    throw new Error('oauth-v1 is not supported with local api bridge');
  }

  return new CcApiClient({
    defaultRequestConfig,
    baseUrl: getBaseUrl(user, auth),
    authMethod: getCcApiAuth(user, auth),
  });
}

/**
 * @param {E2eUser} user
 * @param {Auth} auth
 * @returns {string|null}
 */
function getBaseUrl(user, auth) {
  if (IS_NODE) {
    if (USE_LOCAL_API_BRIDGE) {
      return 'http://localhost:8080';
    }
    return null;
  }
  // if running in browser, we use the proxified URLs
  return `/cc-api-${user.userName}-${auth}`;
}

/**
 * @param {E2eUser} user
 * @param {Auth} auth
 * @returns {CcApiAuth}
 */
function getCcApiAuth(user, auth) {
  // if running in browser, no auth (authentication will be done by the proxy)
  if (!IS_NODE) {
    return null;
  }

  if (auth === 'api-token') {
    return {
      type: 'api-token',
      apiToken: user.apiToken,
    };
  }

  if (auth === 'oauth-v1') {
    return {
      type: 'oauth-v1',
      oauthTokens: user.oauthTokens,
    };
  }
}
