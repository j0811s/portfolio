import { describe, it, expect } from 'vitest';
import { getTotalCount } from '@/src/libs/blog/getTotalCount';

describe('getTotalCount', () => {
  it('同じ id を持つ type を集計できる', () => {
    const contents = [
      {
        tags: [
          { id: 'react', name: 'React', slug: 'react' },
          { id: 'ts', name: 'TypeScript', slug: 'typescript' },
        ],
      },
      {
        tags: [
          { id: 'react', name: 'React', slug: 'react' },
        ],
      },
    ];

    const result = getTotalCount(contents as any, 'tags');

    expect(result).toEqual({
      react: {
        id: 'react',
        name: 'React',
        slug: 'react',
        count: 2,
      },
      ts: {
        id: 'ts',
        name: 'TypeScript',
        slug: 'typescript',
        count: 1,
      },
    });
  });

  it('異なる type を指定すると別の集計になる', () => {
    const contents = [
      {
        categories: [
          { id: 'frontend', name: 'Frontend', slug: 'frontend' },
        ],
      },
      {
        categories: [
          { id: 'frontend', name: 'Frontend', slug: 'frontend' },
          { id: 'backend', name: 'Backend', slug: 'backend' },
        ],
      },
    ];

    const result = getTotalCount(contents as any, 'categories');

    expect(result.frontend.count).toBe(2);
    expect(result.backend.count).toBe(1);
  });

  it('contents が空の場合は空オブジェクトを返す', () => {
    const result = getTotalCount([], 'tags');
    expect(result).toEqual({});
  });
});
