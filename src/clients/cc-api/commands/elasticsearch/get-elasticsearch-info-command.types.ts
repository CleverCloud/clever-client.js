import type { ElasticsearchInfo } from './elasticsearch.types.js';

/**
 * Identifies the Elasticsearch add-on to retrieve the details of.
 */
export interface GetElasticsearchInfoCommandInput {
  /** Identifier of the Elasticsearch add-on. */
  addonId: string;
}

/**
 * The details of the Elasticsearch add-on.
 */
export type GetElasticsearchInfoCommandOutput = ElasticsearchInfo;
