import { describe, expect, it } from 'vitest';
import { listPath, pagedListCanonical } from '@/src/libs/blog/listPath';

describe('listPath', () => {
  it.each([
    ['tags', 'react', undefined, '/blog/tags/react/'],
    ['categories', 'frontend', undefined, '/blog/categories/frontend/'],
    ['archive', '2024', undefined, '/blog/archive/2024/'],
    ['tags', 'react', 2, '/blog/tags/react/page/2/'],
    ['archive', '2024', 3, '/blog/archive/2024/page/3/'],
  ] as const)('(%s, %s, %s) → %s', (slug, id, page, expected) => {
    expect(listPath(slug, id, page)).toBe(expected);
  });
});

describe('pagedListCanonical', () => {
  it('1 ページ目は一覧の先頭と同じ内容なので、先頭を指す', () => {
    expect(pagedListCanonical('tags', 'react', 1)).toBe('/blog/tags/react/');
  });

  it('2 ページ目以降は、そのページ自身を指す', () => {
    expect(pagedListCanonical('categories', 'frontend', 2)).toBe(
      '/blog/categories/frontend/page/2/'
    );
  });
});
