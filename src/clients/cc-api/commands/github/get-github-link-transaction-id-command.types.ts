/**
 * Where to send the user to authorise the GitHub link, and how to identify the flow afterwards.
 */
export interface GetGithubLinkTransactionIdCommandOutput {
  /** Identifier of the linking flow, to be passed back when completing it. */
  transactionId: string;
  /**
   * URL the user must be sent to in order to authorise the link on GitHub.
   * @renamedFrom `redirectUri`
   */
  redirectUrl: string;
}
