import { describe, it, expect } from 'vitest';
import { extractTocFromHtml } from '@/src/libs/blog/extractToc';

describe('extractTocFromHtml', () => {
  it('html が空の場合は空配列を返す', () => {
    expect(extractTocFromHtml('')).toEqual([]);
  });

  it('h2, h3 を抽出できる（デフォルト設定）', () => {
    const html = `
      <h1 id="title">Title</h1>
      <h2 id="section1">Section 1</h2>
      <h3 id="section1-1">Section 1-1</h3>
      <h4 id="section1-1-1">Section 1-1-1</h4>
    `;

    const result = extractTocFromHtml(html);

    expect(result).toEqual([
      { id: 'section1', text: 'Section 1', level: 2 },
      { id: 'section1-1', text: 'Section 1-1', level: 3 },
    ]);
  });

  it('minLevel / maxLevel を指定できる', () => {
    const html = `
      <h2 id="h2">H2</h2>
      <h3 id="h3">H3</h3>
      <h4 id="h4">H4</h4>
    `;

    const result = extractTocFromHtml(html, {
      minLevel: 3,
      maxLevel: 4,
    });

    expect(result).toEqual([
      { id: 'h3', text: 'H3', level: 3 },
      { id: 'h4', text: 'H4', level: 4 },
    ]);
  });

  it('id がない heading は除外される', () => {
    const html = `
      <h2>Without id</h2>
      <h2 id="with-id">With id</h2>
    `;

    const result = extractTocFromHtml(html);

    expect(result).toEqual([
      { id: 'with-id', text: 'With id', level: 2 },
    ]);
  });

  it('heading 内のタグを除去して text を取得できる', () => {
    const html = `
      <h2 id="test">
        <strong>Strong</strong> and <a href="#">Link</a>
      </h2>
    `;

    const result = extractTocFromHtml(html);

    expect(result).toEqual([
      {
        id: 'test',
        text: 'Strong and Link',
        level: 2,
      },
    ]);
  });

  it('text が空になる heading は除外される', () => {
    const html = `
      <h2 id="empty"><span></span></h2>
      <h2 id="valid">Valid</h2>
    `;

    const result = extractTocFromHtml(html);

    expect(result).toEqual([
      { id: 'valid', text: 'Valid', level: 2 },
    ]);
  });
});
