/**
 * @import { CreateOrganisationCommandInput } from '../../src/clients/api/commands/organisation/create-organisation-command.types.js'
 * @import { Organisation } from '../../src/clients/api/commands/organisation/organisation.types.js'
 * @import { CreateAddonCommandInput } from '../../src/clients/api/commands/addon/create-addon-command.types.js'
 * @import { Addon } from '../../src/clients/api/commands/addon/addon.types.js'
 * @import { CcApiAuth } from '../../src/clients/api/types/cc-api.types.js'
 */
import { use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import { CcApiClient } from '../../src/clients/api/cc-api-client.js';
import { CreateAddonCommand } from '../../src/clients/api/commands/addon/create-addon-command.js';
import { DeleteAddonCommand } from '../../src/clients/api/commands/addon/delete-addon-command.js';
import { GetAddonCommand } from '../../src/clients/api/commands/addon/get-addon-command.js';
import { CreateApplicationCommand } from '../../src/clients/api/commands/application/create-application-command.js';
import { DeleteApplicationCommand } from '../../src/clients/api/commands/application/delete-application-command.js';
import { GetApplicationCommand } from '../../src/clients/api/commands/application/get-application-command.js';
import { CreateNetworkGroupCommand } from '../../src/clients/api/commands/network-group/create-network-group-command.js';
import { DeleteNetworkGroupCommand } from '../../src/clients/api/commands/network-group/delete-network-group-command.js';
import { GetNetworkGroupCommand } from '../../src/clients/api/commands/network-group/get-network-group-command.js';
import { CreateOauthConsumerCommand } from '../../src/clients/api/commands/oauth-consumer/create-oauth-consumer-command.js';
import { DeleteOauthConsumerCommand } from '../../src/clients/api/commands/oauth-consumer/delete-oauth-consumer-command.js';
import { GetOauthConsumerCommand } from '../../src/clients/api/commands/oauth-consumer/get-oauth-consumer-command.js';
import { CreateOrganisationCommand } from '../../src/clients/api/commands/organisation/create-organisation-command.js';
import { DeleteOrganisationCommand } from '../../src/clients/api/commands/organisation/delete-organisation-command.js';
import { GetOrganisationCommand } from '../../src/clients/api/commands/organisation/get-organisation-command.js';
import { GetProfileCommand } from '../../src/clients/api/commands/profile/get-profile-command.js';

const IS_NODE = globalThis.process != null;
export const CC_API_TOKEN_GITHUB_UNLINKED = globalThis.process?.env.CC_API_TOKEN_GITHUB_UNLINKED;
export const CC_API_TOKEN_GITHUB_LINKED = globalThis.process?.env.CC_API_TOKEN_GITHUB_LINKED;
const DEFAULT_CLIENT_AUTH = 'GITHUB_LINKED';

// todo: remove that when ready
const USE_OAUTH = false;
const USE_LOCAL_AUTH_BACKEND = false;

use(deepEqualInAnyOrder);

/**
 * @param {boolean} [debug=false]
 */
export function e2eSupport(debug = false) {
  const clients = {
    NONE: createCcApiClient('NONE', debug),
    DEV: createCcApiClient('DEV', debug),
    GITHUB_UNLINKED: createCcApiClient('GITHUB_UNLINKED', debug),
    GITHUB_LINKED: createCcApiClient('GITHUB_LINKED', debug),
  };

  const client = clients[DEFAULT_CLIENT_AUTH];
  /** @type {string} */
  let organisationId;
  /** @type {string} */
  let userId;

  /** @type {Array<{type: 'application'|'addon'|'ng'|'consumer'|'organisation', id: string}>} */
  let cleanupTasks = [];

  return {
    /**
     * @param {'NONE'|'GITHUB_UNLINKED'|'GITHUB_LINKED'|'DEV'} auth
     * @return {CcApiClient}
     */
    getClient(auth) {
      return clients[auth];
    },
    get client() {
      return client;
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
      const self = await client.send(new GetProfileCommand());
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
          client
            .send(new GetOrganisationCommand({ organisationId: organisation.id }))
            .then((a) => a && client.send(new DeleteOrganisationCommand({ organisationId: organisation.id }))),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'organisation');
    },
    async deleteApplications() {
      // const applications = await client.send(new ListApplicationCommand({ ownerId: organisationId }));

      const applications = cleanupTasks.filter((task) => task.type === 'application');
      await Promise.all(
        applications.map((application) =>
          client
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
                client.send(new DeleteApplicationCommand({ ownerId: organisationId, applicationId: application.id })),
            ),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'application');
    },
    async deleteAddons() {
      // const addons = await client.send(new ListAddonCommand({ ownerId: organisationId }));

      const addons = cleanupTasks.filter((task) => task.type === 'addon');
      await Promise.all(
        addons.map((addon) =>
          client
            .send(new GetAddonCommand({ ownerId: organisationId, addonId: addon.id }))
            .then((a) => a && client.send(new DeleteAddonCommand({ ownerId: organisationId, addonId: addon.id }))),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'addon');
    },
    async deleteNetworkGroups() {
      // const networkGroups = await client.send(new ListNetworkGroupCommand({ ownerId: organisationId }));

      const networkGroups = cleanupTasks.filter((task) => task.type === 'ng');
      await Promise.all(
        networkGroups.map((ng) =>
          client
            .send(new GetNetworkGroupCommand({ ownerId: organisationId, networkGroupId: ng.id }))
            .then(
              (a) =>
                a && client.send(new DeleteNetworkGroupCommand({ ownerId: organisationId, networkGroupId: ng.id })),
            ),
        ),
      );
      cleanupTasks = cleanupTasks.filter((task) => task.type !== 'ng');
    },
    async deleteConsumers() {
      // const consumers = await client.send(new ListOauthConsumerCommand({ ownerId: organisationId }));

      const consumers = cleanupTasks.filter((task) => task.type === 'consumer');
      await Promise.all(
        consumers.map((consumer) =>
          client
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
                client.send(new DeleteOauthConsumerCommand({ ownerId: organisationId, oauthConsumerKey: consumer.id })),
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
      const createdOrganisation = await client.send(
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
    async createTestApplication(name = 'test-application') {
      const application = await client.send(
        new CreateApplicationCommand({
          ownerId: organisationId,
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
     * @param {CreateAddonCommandInput} [addon]
     * @returns {Promise<Addon>}
     */
    async createTestAddon(addon) {
      let createdAddon = await client.send(
        new CreateAddonCommand(
          addon ?? {
            ownerId: organisationId,
            name: 'test-addon',
            providerId: 'mysql-addon',
            planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
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
     */
    async createNetworkGroup(memberId) {
      const networkGroup = await client.send(
        new CreateNetworkGroupCommand({
          ownerId: organisationId,
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
      const consumer = await client.send(
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
 * @param {'NONE'|'GITHUB_UNLINKED'|'GITHUB_LINKED'|'DEV'} auth
 * @param {boolean} debug
 * @returns {CcApiClient}
 */
function createCcApiClient(auth, debug) {
  const defaultRequestConfig = { debug };

  return new CcApiClient({
    defaultRequestConfig,
    baseUrl: getBaseUrl(auth),
    authMethod: getAuthMethod(auth),
  });
}

/**
 * @param {'NONE'|'GITHUB_UNLINKED'|'GITHUB_LINKED'|'DEV'} auth
 * @returns {string|null}
 */
function getBaseUrl(auth) {
  if (IS_NODE) {
    if (USE_LOCAL_AUTH_BACKEND) {
      return 'http://localhost:8080';
    }
    return null;
  }
  // if running in browser, we use the proxified URLs
  switch (auth) {
    case 'NONE':
      return '/cc-api-none';
    case 'GITHUB_UNLINKED':
      return '/cc-api-github-unlinked';
    case 'GITHUB_LINKED':
      return '/cc-api-github-linked';
  }
}

/**
 * @param {'NONE'|'GITHUB_UNLINKED'|'GITHUB_LINKED'|'DEV'} auth
 * @returns {CcApiAuth}
 */
function getAuthMethod(auth) {
  if (!IS_NODE || auth === 'NONE') {
    return null;
  }

  switch (auth) {
    case 'DEV':
      return {
        type: 'api-token',
        apiToken: globalThis.process?.env.CC_API_TOKEN_DEV,
      };
    case 'GITHUB_UNLINKED':
      if (USE_OAUTH) {
        return {
          type: 'oauth-v1-plaintext',
          oauthTokens: {
            consumerKey: globalThis.process?.env.OAUTH_CONSUMER_KEY,
            consumerSecret: globalThis.process?.env.OAUTH_CONSUMER_SECRET,
            token: globalThis.process?.env.CC_API_OAUTH_TOKEN_GITHUB_UNLINKED,
            secret: globalThis.process?.env.CC_API_OAUTH_SECRET_GITHUB_UNLINKED,
          },
        };
      }
      return {
        type: 'api-token',
        apiToken: CC_API_TOKEN_GITHUB_UNLINKED,
      };
    case 'GITHUB_LINKED':
      if (USE_LOCAL_AUTH_BACKEND || !USE_OAUTH) {
        return {
          type: 'api-token',
          apiToken: CC_API_TOKEN_GITHUB_LINKED,
        };
      }
      return {
        type: 'oauth-v1-plaintext',
        oauthTokens: {
          consumerKey: globalThis.process?.env.OAUTH_CONSUMER_KEY,
          consumerSecret: globalThis.process?.env.OAUTH_CONSUMER_SECRET,
          token: globalThis.process?.env.CC_API_OAUTH_TOKEN_GITHUB_LINKED,
          secret: globalThis.process?.env.CC_API_OAUTH_SECRET_GITHUB_LINKED,
        },
      };
  }
}
