import type { Article } from './article.types.js';

export interface ListArticleCommandInput {
  /** Language of the feed to fetch, defaults to `en`. An unsupported language falls back to `en`. */
  lang?: 'en' | 'fr';
  /**
   * Maximum number of articles to return, defaults to 10. Going beyond one feed page (10 articles)
   * costs one extra request per page.
   */
  limit?: number;
}

/**
 * The latest articles, sorted by publication date, most recent first, capped to `limit`.
 */
export type ListArticleCommandOutput = Array<Article>;
