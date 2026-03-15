import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Breadcrumb from '@/src/components/ui/Breadcrumb';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('@/src/libs/seo/jsonLd', () => ({
  createBreadcrumbJsonLd: vi.fn(() => ({})),
}));

vi.mock('@/src/components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/src/components')>();
  return {
    ...actual,
    JsonLd: () => null,
  };
});

describe('Breadcrumb', () => {
  it('配列でない場合は何も表示しない', () => {
    const { container } = render(<Breadcrumb data={null as any} />);
    expect(container.querySelector('nav')).toBeNull();
  });

  it('最後のアイテムはリンクではなくテキストで表示される', () => {
    const data = [
      { name: 'トップ', url: '/' },
      { name: 'ブログ', url: '/blog' },
    ];
    render(<Breadcrumb data={data} />);
    expect(screen.getByRole('link', { name: 'トップ' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'ブログ' })).toBeNull();
    expect(screen.getByText('ブログ')).toBeTruthy();
  });

  it('最後以外のアイテムはリンクとして表示される', () => {
    const data = [
      { name: 'トップ', url: '/' },
      { name: 'ブログ', url: '/blog' },
      { name: '記事タイトル', url: '/blog/1' },
    ];
    render(<Breadcrumb data={data} />);
    expect(screen.getByRole('link', { name: 'トップ' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: 'ブログ' }).getAttribute('href')).toBe('/blog');
    expect(screen.queryByRole('link', { name: '記事タイトル' })).toBeNull();
  });

  it('1件のみの場合は最後のアイテムとして表示される', () => {
    const data = [{ name: 'トップ', url: '/' }];
    render(<Breadcrumb data={data} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('トップ')).toBeTruthy();
  });
});
