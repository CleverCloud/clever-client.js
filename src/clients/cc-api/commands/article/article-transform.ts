import { normalizeDate } from '../../../../lib/utils.js';
import { parseHtmlString, parseXmlString } from '../../../../lib/xml/xml-parser.js';
import type { Article } from './article.types.js';

/**
 * Parses an RSS feed document into a list of articles.
 *
 * The `<description>` of a WordPress feed item is an HTML fragment, so it is parsed a second time to
 * pull the banner and the article excerpt out of it.
 *
 * @param xmlStr - Raw RSS feed document
 * @throws {Error} When the feed cannot be parsed
 */
export async function parseRssFeed(xmlStr: string): Promise<Array<Article>> {
  const doc = await parseXmlString(xmlStr);

  // browsers report a malformed document with a `<parsererror>` element instead of throwing
  const error = doc.querySelector('parsererror');
  if (error != null) {
    throw new Error(`Could not parse the RSS feed: ${error.textContent}`);
  }

  const items = Array.from(doc.querySelectorAll('item'));

  return Promise.all(items.map((item) => parseItem(item)));
}

async function parseItem(item: Element): Promise<Article> {
  const title = getTextContent(item, 'title');
  const articleUrl = getTextContent(item, 'link');
  const publishedAt = parsePubDate(getTextContent(item, 'pubDate'));
  const { bannerUrl, description } = await parseDescription(getTextContent(item, 'description'));

  return { title, articleUrl, publishedAt, bannerUrl, description };
}

/**
 * Normalizes the RFC 822 date an item `<pubDate>` holds.
 *
 * A date it cannot parse comes out of `normalizeDate()` as a bare `RangeError`, which says nothing
 * about the feed, so it is reported like the other malformed feed failures.
 */
function parsePubDate(pubDate: string): string {
  try {
    return normalizeDate(pubDate)!;
  } catch {
    throw new Error(`Could not parse the RSS feed: an item has an invalid <pubDate>: ${pubDate}`);
  }
}

/**
 * Parses the HTML fragment held by an item `<description>`.
 *
 * The banner is the post thumbnail WordPress injects at the top of the excerpt. The excerpt is the
 * first paragraph holding actual text: the thumbnail sits alone in a paragraph of its own, and posts
 * commonly start with empty spacer paragraphs or a heading. Falling back to the whole text keeps
 * articles written without any paragraph readable.
 */
async function parseDescription(descriptionHtml: string): Promise<{ bannerUrl?: string; description: string }> {
  const doc = await parseHtmlString(descriptionHtml);
  const body = doc.body;

  if (body == null) {
    return { description: '' };
  }

  const paragraphs = Array.from(body.querySelectorAll('p'))
    .map((paragraph) => paragraph.textContent?.trim() ?? '')
    .filter((text) => text !== '');

  return {
    bannerUrl: body.querySelector('.wp-post-image')?.getAttribute('src') ?? undefined,
    description: paragraphs[0] ?? body.textContent?.trim() ?? '',
  };
}

function getTextContent(item: Element, tagName: string): string {
  const element = item.querySelector(tagName);

  if (element == null) {
    throw new Error(`Could not parse the RSS feed: an item has no <${tagName}> element.`);
  }

  return element.textContent ?? '';
}
