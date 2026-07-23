import type { GetGrafanaCommandOutput } from './get-grafana-command.types.js';

/**
 * Identifies the owner Grafana is turned on for.
 */
export interface EnableGrafanaCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * The Grafana organisation that was created, read back after the fact.
 */
export type EnableGrafanaCommandOutput = GetGrafanaCommandOutput;
