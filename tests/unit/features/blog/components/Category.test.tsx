import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Category from '@/src/features/blog/components/Category';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('Category', () => {
  const data = { id: 'cat-1', name: 'JavaScript', count: 0 };

  it('カテゴリ名へのリンクが表示される', () => {
    render(<Category data={data} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/blog/categories/cat-1');
    expect(screen.getByText('JavaScript')).toBeTruthy();
  });

  it('totalCount が指定されていない場合はバッジが表示されない', () => {
    render(<Category data={data} />);
    expect(screen.queryByText(/\(/)).toBeNull();
  });

  it('totalCount が指定された場合はバッジが表示される', () => {
    render(<Category data={data} totalCount={5} />);
    expect(screen.getByText('(5)')).toBeTruthy();
  });

  it('totalCount が文字列の場合でもバッジが表示される', () => {
    render(<Category data={data} totalCount="12" />);
    expect(screen.getByText('(12)')).toBeTruthy();
  });
});
