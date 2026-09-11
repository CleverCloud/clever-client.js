import { describe, expect, it } from 'vitest';
import { parseRssFeed } from '../../../../../../src/clients/cc-api/commands/article/article-transform.js';
import { expectPromiseThrows } from '../../../../../lib/expect-utils.js';

/**
 * Mirrors the shape of the Clever Cloud blog feed: items carry an HTML `<description>` starting with
 * the post thumbnail, followed by the excerpt paragraph.
 */
function buildFeed(items: Array<string>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Clever Cloud</title>
  <link>https://www.clever.cloud/</link>
  ${items.join('\n')}
</channel></rss>`;
}

function buildItem({
  title = 'An article',
  link = 'https://www.clever.cloud/blog/an-article/',
  pubDate = 'Wed, 15 Jul 2026 14:46:35 +0000',
  description = `<![CDATA[<p><img src="https://cdn.clever-cloud.com/banner.png" class="attachment-post-thumbnail wp-post-image" alt="" /></p><p>The excerpt.</p>]]>`,
} = {}): string {
  return `<item>
    <title>${title}</title>
    <link>${link}</link>
    <pubDate>${pubDate}</pubDate>
    <description>${description}</description>
  </item>`;
}

describe('article-transform', () => {
  describe('parseRssFeed', () => {
    it('should parse an item into an article', async () => {
      const articles = await parseRssFeed(buildFeed([buildItem()]));

      expect(articles).toEqual([
        {
          title: 'An article',
          articleUrl: 'https://www.clever.cloud/blog/an-article/',
          publishedAt: '2026-07-15T14:46:35.000Z',
          bannerUrl: 'https://cdn.clever-cloud.com/banner.png',
          description: 'The excerpt.',
        },
      ]);
    });

    it('should return the articles in feed order', async () => {
      const articles = await parseRssFeed(
        buildFeed([buildItem({ title: 'First' }), buildItem({ title: 'Second' }), buildItem({ title: 'Third' })]),
      );

      expect(articles.map((article) => article.title)).toEqual(['First', 'Second', 'Third']);
    });

    it('should return an empty array when the feed has no item', async () => {
      expect(await parseRssFeed(buildFeed([]))).toEqual([]);
    });

    it('should leave the banner absent when the description has no post thumbnail', async () => {
      const feed = buildFeed([buildItem({ description: `<![CDATA[<p>Only an excerpt.</p>]]>` })]);

      expect((await parseRssFeed(feed))[0].bannerUrl).toBeUndefined();
    });

    // WordPress posts commonly open with a heading or an empty spacer paragraph before the excerpt
    it('should skip the empty paragraphs preceding the excerpt', async () => {
      const feed = buildFeed([
        buildItem({
          description: `<![CDATA[<p><img src="https://cdn.clever-cloud.com/banner.png" class="wp-post-image" /></p><h3>Where to find us</h3><p></p><p>The excerpt.</p>]]>`,
        }),
      ]);

      expect((await parseRssFeed(feed))[0].description).toBe('The excerpt.');
    });

    it('should fall back to the whole description text when there is no excerpt paragraph', async () => {
      const feed = buildFeed([buildItem({ description: `<![CDATA[Not wrapped in paragraphs.]]>` })]);

      expect((await parseRssFeed(feed))[0].description).toBe('Not wrapped in paragraphs.');
    });

    it('should throw when an item has a pubDate it cannot parse', async () => {
      const feed = buildFeed([buildItem({ pubDate: 'someday' })]);

      await expectPromiseThrows<Error>(parseRssFeed(feed), (error) => {
        expect(error.message).toMatch(/an item has an invalid <pubDate>: someday/);
      });
    });

    // an HTML page is well formed enough for both parsers to accept it, so it reaches the same
    // check in the browser and in Node
    it('should throw when the document is not a feed', async () => {
      const page = '<!DOCTYPE html><html><body><h1>Not found</h1></body></html>';

      await expectPromiseThrows<Error>(parseRssFeed(page), (error) => {
        expect(error.message).toMatch(/the document has no <channel> element/);
      });
    });

    // browsers report a `<parsererror>` here, `linkedom` parses leniently and finds no `<channel>`
    it('should throw when the document cannot be parsed at all', async () => {
      await expectPromiseThrows<Error>(parseRssFeed('not xml at all'), (error) => {
        expect(error.message).toMatch(/Could not parse the RSS feed/);
      });
    });

    it('should throw when an item misses an element', async () => {
      const feed = buildFeed([`<item><title>An article</title></item>`]);

      await expectPromiseThrows<Error>(parseRssFeed(feed), (error) => {
        expect(error.message).toMatch(/no <link> element/);
      });
    });
  });
});
