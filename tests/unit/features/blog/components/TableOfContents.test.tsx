import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TableOfContents from '@/src/features/blog/components/TableOfContents';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

describe('TableOfContents', () => {
  it('content が undefined の場合は何も表示しない', () => {
    const { container } = render(<TableOfContents />);
    expect(container.firstChild).toBeNull();
  });

  it('content が空文字の場合は何も表示しない', () => {
    const { container } = render(<TableOfContents content="" />);
    expect(container.firstChild).toBeNull();
  });

  it('h2/h3 が存在しない場合は何も表示しない', () => {
    const content = '<p>テキストのみ</p><h1 id="title">タイトル</h1>';
    const { container } = render(<TableOfContents content={content} />);
    expect(container.firstChild).toBeNull();
  });

  it('h2/h3 が存在する場合は目次を表示する', () => {
    const content = `
      <h2 id="section1">セクション1</h2>
      <h3 id="section1-1">セクション1-1</h3>
    `;
    render(<TableOfContents content={content} />);
    expect(screen.getByRole('navigation', { name: '目次' })).toBeTruthy();
    expect(screen.getByText('セクション1')).toBeTruthy();
    expect(screen.getByText('セクション1-1')).toBeTruthy();
  });

  it('各アイテムのリンクに正しい href が設定される', () => {
    const content = '<h2 id="my-section">マイセクション</h2>';
    render(<TableOfContents content={content} />);
    const link = screen.getByRole('link', { name: 'マイセクション' });
    expect(link.getAttribute('href')).toBe('#my-section');
  });

  it('details 要素が open 状態でレンダリングされる', () => {
    const content = '<h2 id="section">セクション</h2>';
    render(<TableOfContents content={content} />);
    const details = screen.getByRole('group');
    expect(details.hasAttribute('open')).toBe(true);
  });

  it('h1 と h4 は目次に含まれない', () => {
    const content = `
      <h1 id="h1">見出し1</h1>
      <h2 id="h2">見出し2</h2>
      <h4 id="h4">見出し4</h4>
    `;
    render(<TableOfContents content={content} />);
    expect(screen.queryByText('見出し1')).toBeNull();
    expect(screen.getByText('見出し2')).toBeTruthy();
    expect(screen.queryByText('見出し4')).toBeNull();
  });
});
