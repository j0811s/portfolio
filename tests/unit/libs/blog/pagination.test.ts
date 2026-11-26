import { describe, expect, it } from 'vitest';
import {
  countPages,
  isPageInRange,
  pageNumbers,
  parsePageNumber,
} from '@/src/libs/blog/pagination';

describe('countPages', () => {
  it.each([
    [0, 1],
    [1, 1],
    [12, 1],
    [13, 2],
    [24, 2],
    [25, 3],
  ])('記事 %i 件なら 1 ページ 12 件で %i ページ', (totalCount, expected) => {
    expect(countPages(totalCount, 12)).toBe(expected);
  });
});

describe('pageNumbers', () => {
  it('記事数に応じたページ番号を文字列で返す', () => {
    expect(pageNumbers(25, 12)).toEqual(['1', '2', '3']);
  });

  it('記事が 0 件でも 1 ページ目は返す', () => {
    expect(pageNumbers(0, 12)).toEqual(['1']);
  });
});

describe('parsePageNumber', () => {
  it.each([
    ['1', 1],
    ['12', 12],
  ])('%s は %i にする', (num, expected) => {
    expect(parsePageNumber(num)).toBe(expected);
  });

  it.each(['0', '-1', '01', '1.5', 'abc', '', '1e2'])(
    '%s は 1 以上の整数の表記ではないので undefined',
    (num) => {
      expect(parsePageNumber(num)).toBeUndefined();
    }
  );
});

describe('isPageInRange', () => {
  it('ページ数以下なら true、超えたら false', () => {
    expect(isPageInRange(2, 13, 12)).toBe(true);
    expect(isPageInRange(3, 13, 12)).toBe(false);
  });

  it('記事が 0 件でも 1 ページ目は範囲内', () => {
    expect(isPageInRange(1, 0, 12)).toBe(true);
    expect(isPageInRange(2, 0, 12)).toBe(false);
  });
});
