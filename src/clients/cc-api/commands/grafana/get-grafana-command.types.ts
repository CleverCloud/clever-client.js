/**
 * Identifies the owner whose Grafana organisation is read.
 */
export interface GetGrafanaCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * A handle on the owner's Grafana organisation.
 */
export interface GetGrafanaCommandOutput {
  /** Identifier of the organisation inside Grafana, used to build the dashboard URLs. */
  id: number;
}
