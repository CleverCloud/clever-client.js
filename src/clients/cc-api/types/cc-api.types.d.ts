import type { CompositeCommand, SimpleCommand } from '../../../lib/command/command.js';
import type { OauthTokens } from '../../../types/auth.types.js';
import type { CcClientConfig } from '../../../types/client.types.js';
import type { Composer } from '../../../types/command.types.js';
import type { WithOptional } from '../../../types/utils.types.js';
import type { ResourceIdIndex, Store } from './resource-id-resolver.types.js';

/**
 * Type identifier for the Clever Cloud API client.
 */
export type CcApiType = 'cc-api';

/**
 * Configuration for the Clever Cloud API client.
 * Extends the base client config but makes baseUrl optional since it's determined by auth method.
 *
 * @example
 * const config: CcApiClientConfig = {
 *   authMethod: {
 *     type: 'oauth-v1',
 *     oauthTokens: {
 *       consumerKey: 'key',
 *       consumerSecret: 'secret',
 *       token: 'token',
 *       secret: 'secret'
 *     }
 *   },
 *   resourceIdResolverStore: new LocalStorageStore('my-cache')
 * };
 */
export interface CcApiClientConfig extends WithOptional<CcClientConfig, 'baseUrl'> {
  /**
   * Storage backend for caching resource ID mappings
   */
  resourceIdResolverStore?: Store<ResourceIdIndex>;

  /**
   * Authentication method configuration
   */
  authMethod?: CcApiAuth;
}

/**
 * Authentication configuration for the Clever Cloud API.
 * Supports either API token or OAuth v1 authentication.
 */
export type CcApiAuth = CcApiAuthWithApiToken | CcApiAuthWithOauthV1PlainText;

/**
 * API token authentication configuration.
 * Uses the API bridge endpoint (api-bridge.clever-cloud.com).
 */
export interface CcApiAuthWithApiToken {
  /** Identifies this as API token authentication */
  type: 'api-token';
  /** The API token to authenticate with */
  apiToken: string;
}

/**
 * OAuth v1 authentication configuration.
 * Uses the main API endpoint (api.clever-cloud.com).
 */
export interface CcApiAuthWithOauthV1PlainText {
  /** Identifies this as OAuth v1 authentication */
  type: 'oauth-v1';
  /** OAuth tokens for authentication */
  oauthTokens: OauthTokens;
}

/**
 * A command that can be sent to the Clever Cloud API.
 * Can be either a simple command (single request) or a composite command (multiple requests).
 *
 * @template CommandInput - Type of the command's input parameters
 * @template CommandOutput - Type of the command's output
 */
export type CcApiCommand<CommandInput, CommandOutput> =
  | SimpleCommand<CcApiType, CommandInput, CommandOutput>
  | CompositeCommand<CcApiType, CommandInput, CommandOutput>;

/**
 * Function type for composing multiple API commands into a single operation.
 */
export type CcApiComposer = Composer<CcApiType>;

/**
 * Adds an optional owner ID field to a type.
 * Used to explicitly specify an organization ID instead of resolving it.
 *
 * @template T - Base type to add owner ID to
 */
export type MaybeWithOwnerId<T> = T & { ownerId?: string };

/**
 * Union type for application or addon identifiers.
 * Used when an API endpoint accepts either type of resource.
 */
export type ApplicationOrAddonId = ApplicationId | AddonId;

/**
 * Union type for all resource identifiers in the API.
 * Each resource can optionally include its owner ID.
 */
export type ResourceId = ApplicationId | AddonId | AddonProviderId | OauthConsumerKey;

/**
 * Application identifier with optional owner ID.
 *
 * @example
 * const id: ApplicationId = { applicationId: 'app_123' };
 * // With explicit owner
 * const id: ApplicationId = { applicationId: 'app_123', ownerId: 'org_456' };
 */
export type ApplicationId = MaybeWithOwnerId<{ applicationId: string }>;

/**
 * Addon identifier with optional owner ID.
 * Can be either a public addon ID or a real addon ID.
 */
export type AddonId = MaybeWithOwnerId<{ addonId: string }>;

/**
 * Addon provider identifier with optional owner ID.
 */
export type AddonProviderId = MaybeWithOwnerId<{ addonProviderId: string }>;

/**
 * OAuth consumer key identifier with optional owner ID.
 */
export type OauthConsumerKey = MaybeWithOwnerId<{ oauthConsumerKey: string }>;
