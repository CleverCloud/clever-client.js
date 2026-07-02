import type { ElasticsearchInfo } from './elasticsearch.types.js';

export interface GetElasticsearchInfoCommandInput {
  addonId: string;
}

export type GetElasticsearchInfoCommandOutput = ElasticsearchInfo;
