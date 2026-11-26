import { describe, expect, it } from 'vitest';
import { countPostsByYear, isValidYear } from '@/src/libs/blog/countPostsByYear';

describe('countPostsByYear', () => {
  it('公開年ごとに記事数を数え、公開日の無い記事は数えない', () => {
    const contents = [
      { publishedAt: '2024-01-01T00:00:00.000Z' },
      { publishedAt: '2024-12-31T00:00:00.000Z' },
      { publishedAt: '2023-06-01T00:00:00.000Z' },
      { publishedAt: undefined },
    ];

    expect(countPostsByYear(contents as Pick<Blog, 'publishedAt'>[])).toEqual({
      '2024': 2,
      '2023': 1,
    });
  });
});

describe('isValidYear', () => {
  it.each([
    ['2024', true],
    ['20', false],
    ['20245', false],
    ['abcd', false],
  ])('%s → %s', (year, expected) => {
    expect(isValidYear(year)).toBe(expected);
  });
});
