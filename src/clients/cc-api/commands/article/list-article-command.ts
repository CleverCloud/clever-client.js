import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { QueryParams } from '../../../../lib/request/query-params.js';
import { sortBy } from '../../../../lib/utils.js';
import type { CcRequestConfigPartial, CcRequestParams } from '../../../../types/request.types.ts';
import { isCcHttpError } from '../../../../utils/error-utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { parseRssFeed } from './article-transform.js';
import type { Article } from './article.types.js';
import type { ListArticleCommandInput, ListArticleCommandOutput } from './list-article-command.types.js';

const FEED_URLS = {
  en: 'https://www.clever.cloud/feed/',
  fr: 'https://www.clever.cloud/fr/feed/',
};

const DEFAULT_LANG = 'en';
const DEFAULT_LIMIT = 10;
/** The blog publishes a few articles a week at most, so a long lived cache is enough to stay up to date */
const DEFAULT_CACHE_TTL = 4 * 60 * 60 * 1000;

/**
 * Lists the latest articles from the Clever Cloud blog.
 *
 * The blog feed lives outside the API base URL, so this command targets an absolute URL, is sent without
 * the client credentials, and enables CORS, which browsers need to reach that other origin.
 *
 * Articles are sorted by publication date, most recent first.
 *
 * Feed pages are cached for 4 hours by default, which a caller can override:
 *
 * ```javascript
 * await client.send(new ListArticleCommand({ lang: 'fr' }), { cache: { mode: 'reload' } });
 * ```
 *
 * @endpoint [GET] https://www.clever.cloud/feed/
 * @endpoint [GET] https://www.clever.cloud/fr/feed/
 * @group Article
 */
export class ListArticleCommand extends CcApiCompositeCommand<ListArticleCommandInput, ListArticleCommandOutput> {
  async compose(params: ListArticleCommandInput, composer: CcApiComposer): Promise<ListArticleCommandOutput> {
    const lang = params.lang != null && params.lang in FEED_URLS ? params.lang : DEFAULT_LANG;
    const limit = params.limit ?? DEFAULT_LIMIT;

    const articles: Array<Article> = [];
    // the page size is read from the first page instead of being hardcoded: a shorter page after it
    // means the feed is exhausted
    let pageSize: number | null = null;

    for (let page = 1; articles.length < limit; page++) {
      const pageArticles = await getFeedPage(composer, { lang, page });

      if (pageArticles.length === 0) {
        break;
      }

      articles.push(...pageArticles);
      pageSize ??= pageArticles.length;

      if (pageArticles.length < pageSize) {
        break;
      }
    }

    return sortBy(articles, { key: 'publishedAt', order: 'desc' }).slice(0, limit);
  }
}

/**
 * Fetches one feed page, treating the end of the feed as an empty page.
 *
 * Past its last page the feed answers `404` rather than an empty document. That only means "no more
 * articles" for a page we reached by paging, so a `404` on the very first page is still an error.
 */
async function getFeedPage(composer: CcApiComposer, params: ListArticlePageCommandInput): Promise<Array<Article>> {
  try {
    return await composer.send(new ListArticlePageCommand(params));
  } catch (error) {
    if (params.page > 1 && isCcHttpError(error) && error.statusCode === 404) {
      return [];
    }

    throw error;
  }
}

interface ListArticlePageCommandInput {
  lang: 'en' | 'fr';
  page: number;
}

/**
 * @endpoint [GET] https://www.clever.cloud/feed/
 * @endpoint [GET] https://www.clever.cloud/fr/feed/
 * @group Article
 */
class ListArticlePageCommand extends CcApiSimpleCommand<ListArticlePageCommandInput, Array<Article>> {
  toRequestParams(params: ListArticlePageCommandInput): Partial<CcRequestParams> {
    const queryParams = new QueryParams().append('format', 'excerpt');

    // the first page is the feed URL itself: `paged=1` redirects to it
    if (params.page > 1) {
      queryParams.append('paged', params.page);
    }

    return {
      method: 'GET',
      url: FEED_URLS[params.lang],
      queryParams,
      headers: new HeadersBuilder().accept('application/rss+xml').build(),
    };
  }

  async transformCommandOutput(response: Blob): Promise<Array<Article>> {
    return parseRssFeed(await response.text());
  }

  isAuthEnabled(): boolean {
    return false;
  }

  getRequestConfig(): CcRequestConfigPartial {
    return { isCorsEnabled: true, cache: { ttl: DEFAULT_CACHE_TTL } };
  }
}
