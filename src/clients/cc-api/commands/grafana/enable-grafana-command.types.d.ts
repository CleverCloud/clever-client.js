import type { GetGrafanaCommandOutput } from './get-grafana-command.types.js';

export interface EnableGrafanaCommandInput {
  ownerId: string;
}

export type EnableGrafanaCommandOutput = GetGrafanaCommandOutput;
