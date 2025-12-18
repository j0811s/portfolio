import { SITE_URL } from "@/src/constants/site";

// パンくずリスト
export const createBreadcrumbJsonLd = (
  items: { name: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// TOP
export const createWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ポートフォリオサイト",
  url: SITE_URL
});

// 投稿ページ
export const createArticleJsonLd = (article: {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": article.url,
  },
});
