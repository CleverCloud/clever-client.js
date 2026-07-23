/**
 * What the token should be scoped to: a whole organisation, or a single application within one.
 */
export type GetWarpTokenCommandInput = GetWarpTokenCommandInputOwner | GetWarpTokenCommandInputResource;

/**
 * Asks for a token covering every resource of an organisation.
 */
export interface GetWarpTokenCommandInputOwner extends GetWarpTokenCommandInputBase {
  /** Identifier of the user or organisation the token is scoped to. */
  ownerId: string;
}

/**
 * Asks for a token covering a single application.
 */
export interface GetWarpTokenCommandInputResource extends GetWarpTokenCommandInputBase {
  /** Identifier of the owner. Resolved automatically when omitted. */
  ownerId?: string;
  /** Identifier of the application the token is scoped to. */
  applicationId: string;
}

/**
 * The options shared by both scopes.
 */
export interface GetWarpTokenCommandInputBase {
  /** Time series the token may read. Defaults to every series the caller is allowed to read. */
  applications?: Array<WarpTokenApplication>;
  /** How long the token stays valid, as an ISO 8601 duration. Defaults to the platform lifetime. */
  ttl?: string;
}

/**
 * A family of time series a Warp10 token can be scoped to: platform metrics, access logs, or the
 * Cellar usage series.
 */
export type WarpTokenApplication = 'metrics' | 'metrics.accesslogs' | 'addon-api-cellar';

/**
 * A Warp10 read token, ready to be passed to the time series endpoints.
 */
export interface GetWarpTokenCommandOutput {
  /** The token itself. */
  token: string;
  /**
   * When the token stops being accepted.
   * @converted to an ISO date string
   */
  expiresAt: string;
  /**
   * When the token was issued.
   * @converted to an ISO date string
   */
  createdAt: string;
  /** Access the token grants. Always read-only for this command. */
  scope: 'READ';
  /** Time series the token may actually read. */
  applications: Array<WarpTokenApplication>;
}
