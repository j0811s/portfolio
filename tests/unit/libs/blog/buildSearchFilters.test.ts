import { describe, it, expect } from 'vitest';
import { buildSearchFilters } from '@/src/libs/blog/buildSearchFilters';

describe('buildSearchFilters', () => {
  it('1語はタイトル・本文のいずれかに含まれる条件になる', () => {
    expect(buildSearchFilters('React')).toBe('(title[contains]React[or]content[contains]React)');
  });

  it('空白区切りの複数語は AND 条件になる（全角スペースも区切る）', () => {
    expect(buildSearchFilters(' Next.js　フレーム  ')).toBe(
      '(title[contains]Next.js[or]content[contains]Next.js)[and](title[contains]フレーム[or]content[contains]フレーム)'
    );
  });

  it('filters の構文として解釈される括弧は除く', () => {
    expect(buildSearchFilters('a[or]b(c)')).toBe(
      '(title[contains]a[or]content[contains]a)[and](title[contains]or[or]content[contains]or)[and](title[contains]b[or]content[contains]b)[and](title[contains]c[or]content[contains]c)'
    );
  });

  it('有効な検索語が無い場合は undefined を返す', () => {
    expect(buildSearchFilters('')).toBeUndefined();
    expect(buildSearchFilters('  ')).toBeUndefined();
    expect(buildSearchFilters('[]()')).toBeUndefined();
  });
});
