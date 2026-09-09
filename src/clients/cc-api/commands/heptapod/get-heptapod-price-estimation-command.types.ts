/**
 * Identifies the owner whose Heptapod usage is estimated.
 */
export interface GetHeptapodPriceEstimationCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * The usage recorded so far and what it is expected to cost.
 */
export interface GetHeptapodPriceEstimationCommandOutput {
  /**
   * Number of active users on public projects, which are billed at a lower rate.
   * @renamedFrom `public_active_users`
   */
  publicActiveUsers: number;
  /**
   * Number of active users on private projects.
   * @renamedFrom `private_active_users`
   */
  privateActiveUsers: number;
  /** Storage used, in bytes. */
  storage: number;
  /** Estimated cost for the period, in the owner's billing currency. */
  price: number;
}
