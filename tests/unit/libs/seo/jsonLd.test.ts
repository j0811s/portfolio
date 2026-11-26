import { describe, expect, it } from 'vitest';
import { SITE_URL } from '@/src/constants/site';
import { createBreadcrumbJsonLd } from '@/src/libs/seo/jsonLd';

describe('createBreadcrumbJsonLd', () => {
  it('相対パスの URL は SITE_URL で絶対 URL にし、絶対 URL はそのまま使う', () => {
    const jsonLd = createBreadcrumbJsonLd([
      { name: 'トップページ', url: SITE_URL },
      { name: '投稿', url: '/blog/' },
      { name: 'React', url: '/blog/tags/react/page/2/' },
    ]);

    expect(jsonLd.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'トップページ',
        item: new URL(SITE_URL).toString(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '投稿',
        item: new URL('/blog/', SITE_URL).toString(),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'React',
        item: new URL('/blog/tags/react/page/2/', SITE_URL).toString(),
      },
    ]);
  });
});
