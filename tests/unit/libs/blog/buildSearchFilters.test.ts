import { describe, it, expect } from 'vitest';
import {
  buildSearchFilters,
  MAX_KEYWORD_LENGTH,
  MAX_SEARCH_TERMS,
} from '@/src/libs/blog/buildSearchFilters';

const condition = (term: string) => `(title[contains]${term}[or]content[contains]${term})`;

describe('buildSearchFilters', () => {
  it('1語はタイトル・本文のいずれかに含まれる条件になる', () => {
    expect(buildSearchFilters('React')).toBe(condition('React'));
  });

  it('空白区切りの複数語は AND 条件になる（全角スペースも区切る）', () => {
    expect(buildSearchFilters(' Next.js　フレーム  ')).toBe(
      `${condition('Next.js')}[and]${condition('フレーム')}`
    );
  });

  it('[or] などを入力しても条件式に注入されず、ただの検索語として扱われる', () => {
    expect(buildSearchFilters('a[or]b(c)')).toBe(
      [condition('a'), condition('or'), condition('b'), condition('c')].join('[and]')
    );
  });

  it('重複する語は1つにまとめる', () => {
    expect(buildSearchFilters('React React')).toBe(condition('React'));
  });

  it(`先頭 ${MAX_SEARCH_TERMS} 語までを条件にする`, () => {
    const terms = Array.from({ length: MAX_SEARCH_TERMS + 3 }, (_, i) => `w${i}`);

    expect(buildSearchFilters(terms.join(' '))).toBe(
      terms.slice(0, MAX_SEARCH_TERMS).map(condition).join('[and]')
    );
  });

  it(`キーワードは先頭 ${MAX_KEYWORD_LENGTH} 文字のみを使う`, () => {
    expect(buildSearchFilters('a'.repeat(MAX_KEYWORD_LENGTH + 50))).toBe(
      condition('a'.repeat(MAX_KEYWORD_LENGTH))
    );
  });

  it('有効な検索語が無い場合は undefined を返す', () => {
    expect(buildSearchFilters('')).toBeUndefined();
    expect(buildSearchFilters('  ')).toBeUndefined();
    expect(buildSearchFilters('[]()')).toBeUndefined();
  });
});
