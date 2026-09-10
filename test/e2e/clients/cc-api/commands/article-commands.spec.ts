import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ListArticleCommand } from '../../../../../src/clients/cc-api/commands/article/list-article-command.js';
import type { ListArticleCommandInput } from '../../../../../src/clients/cc-api/commands/article/list-article-command.types.js';
import { e2eSupport } from '../e2e-support.js';

describe('article commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it.each(['en', 'fr'] as const)('should list the latest %s articles', async (lang) => {
    const response = await support.client.send(new ListArticleCommand({ lang, limit: 3 }));

    expect(response).toHaveLength(3);
    response.forEach((article) => {
      expect(article.title).toBeTypeOf('string');
      expect(article.articleUrl).toMatch(/^https:\/\/www\.clever\.cloud\//);
      expect(article.publishedAt).toBe(new Date(article.publishedAt).toISOString());
      expect(article.description).toBeTypeOf('string');
      expect(article.bannerUrl == null || article.bannerUrl.startsWith('https://')).toBe(true);
    });
  });

  // the fallback guards an untyped caller, so it has to reject a key inherited from `Object` too
  it('should fall back to the default language for an unsupported one', async () => {
    const params = { lang: 'constructor', limit: 1 } as unknown as ListArticleCommandInput;

    const response = await support.client.send(new ListArticleCommand(params));

    expect(response).toHaveLength(1);
    expect(response[0].articleUrl).toMatch(/^https:\/\/www\.clever\.cloud\//);
  });

  // one feed page holds 10 articles, so this walks several pages
  it('should page through the feed to reach the limit', async () => {
    const response = await support.client.send(new ListArticleCommand({ limit: 25 }));

    expect(response).toHaveLength(25);
    expect(new Set(response.map((article) => article.articleUrl)).size).toBe(25);

    const publicationDates = response.map((article) => article.publishedAt);
    expect(publicationDates).toEqual([...publicationDates].sort().reverse());
  });
});
