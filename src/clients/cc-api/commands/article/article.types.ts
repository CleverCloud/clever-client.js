/**
 * A post from the Clever Cloud blog, as published in its RSS feed.
 */
export interface Article {
  /** Title of the article. */
  title: string;
  /** URL of the article on the blog. */
  articleUrl: string;
  /** Publication date, as an ISO string */
  publishedAt: string;
  /** URL of the article banner image, absent when the article has none */
  bannerUrl?: string;
  /** Excerpt of the article, pulled out of the HTML fragment held by the feed item. */
  description: string;
}
