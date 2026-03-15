import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '@/src/features/blog/components/Pagination';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Pagination', () => {
  it('totalCount が 0 の場合は何も表示しない', () => {
    const { container } = render(
      <Pagination pager={{ totalCount: 0, limit: 10 }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('1ページ分のみの場合は nav を表示する', () => {
    render(<Pagination pager={{ totalCount: 5, limit: 10 }} />);
    expect(screen.getByRole('navigation')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('現在のページはリンクではなく div で表示される', () => {
    render(<Pagination pager={{ totalCount: 30, limit: 10, currentPage: 2 }} />);
    const currentPage = screen.getByText('2');
    expect(currentPage.tagName).toBe('DIV');
    expect(currentPage.closest('a')).toBeNull();
  });

  it('現在ページ以外はリンクで表示される', () => {
    render(<Pagination pager={{ totalCount: 30, limit: 10, currentPage: 1 }} />);
    const page2 = screen.getByRole('link', { name: '2' });
    expect(page2.getAttribute('href')).toBe('/blog/page/2');
  });

  it('currentPage <= 3 の場合は先頭省略記号が表示されない', () => {
    // totalCount=100, limit=10 -> 10ページ
    // currentPage=3: firstPageNumber は空, lastPageNumber(3+2=5 < 10)は表示
    render(<Pagination pager={{ totalCount: 100, limit: 10, currentPage: 3 }} />);
    const omits = screen.getAllByText('...');
    expect(omits.length).toBe(1); // 末尾のみ
  });

  it('currentPage > 3 の場合は先頭ページ+省略記号が表示される', () => {
    // currentPage=5: firstPageNumber 表示, lastPageNumber(5+2=7 < 10)も表示
    render(<Pagination pager={{ totalCount: 100, limit: 10, currentPage: 5 }} />);
    const page1Link = screen.getByRole('link', { name: '1' });
    expect(page1Link.getAttribute('href')).toBe('/blog/page/1');
    expect(screen.getAllByText('...').length).toBe(2);
  });

  it('currentPage + 2 < 全ページ数 の場合は末尾ページ+省略記号が表示される', () => {
    // currentPage=5, 10ページ: 5+2=7 < 10 -> 表示
    render(<Pagination pager={{ totalCount: 100, limit: 10, currentPage: 5 }} />);
    const lastLink = screen.getByRole('link', { name: '10' });
    expect(lastLink.getAttribute('href')).toBe('/blog/page/10');
  });

  it('currentPage + 2 >= 全ページ数 の場合は末尾省略記号が表示されない', () => {
    // currentPage=9, 10ページ: 9+2=11 >= 10 -> 非表示
    render(<Pagination pager={{ totalCount: 100, limit: 10, currentPage: 9 }} />);
    const omits = screen.getAllByText('...');
    expect(omits.length).toBe(1); // 先頭のみ
  });

  it('type.slug が指定された場合はカテゴリパスで URL が生成される', () => {
    render(
      <Pagination
        pager={{ totalCount: 20, limit: 10, currentPage: 1 }}
        type={{ slug: 'categories', id: 'cat-1' }}
      />
    );
    const link = screen.getByRole('link', { name: '2' });
    expect(link.getAttribute('href')).toBe('/blog/categories/cat-1/page/2');
  });

  it('type.slug が未指定の場合は /blog/page/ パスで URL が生成される', () => {
    render(<Pagination pager={{ totalCount: 20, limit: 10, currentPage: 1 }} />);
    const link = screen.getByRole('link', { name: '2' });
    expect(link.getAttribute('href')).toBe('/blog/page/2');
  });
});
