import type { BreadcrumbList, WebSite, BlogPosting, WithContext } from 'schema-dts';
import { SITE_URL } from '@/src/constants/site';

// パンくずリスト。`ListItem.item` は絶対 URL にする（canonical と違い metadataBase が効かないため、相対パスを SITE_URL で解決する）
export const createBreadcrumbJsonLd = (
  items: { name: string; url: string }[]
): WithContext<BreadcrumbList> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: new URL(item.url, SITE_URL).toString(),
  })),
});

// TOP
export const createWebsiteJsonLd = (): WithContext<WebSite> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ポートフォリオサイト',
  url: SITE_URL,
});

// 投稿ページ
export const createArticleJsonLd = (article: {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  url: string;
}): WithContext<BlogPosting> => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url,
  },
});
