/**
 * Identifies the owner Grafana is turned off for.
 */
export interface DisableGrafanaCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}
