import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArticleCardList from '@/src/features/blog/components/ArticleCardList';

vi.mock('@/src/features/blog/components/ArticleCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

const createBlogPost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 'post-1',
  title: 'テスト記事',
  content: '<p>本文</p>',
  category: [],
  tag: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  url: 'https://example.com/eyecatch.png',
  ...overrides,
});

describe('ArticleCardList', () => {
  it('contentsがある場合は記事一覧を表示する', () => {
    render(<ArticleCardList contents={[createBlogPost()]} />);
    expect(screen.getByText('テスト記事')).toBeTruthy();
  });

  it('contentsが空でemptyMessage未指定の場合は何も表示しない', () => {
    const { container } = render(<ArticleCardList contents={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('contentsが空でemptyMessage指定時はメッセージを表示する', () => {
    render(<ArticleCardList contents={[]} emptyMessage="該当する記事が見つかりませんでした。" />);
    expect(screen.getByText('該当する記事が見つかりませんでした。')).toBeTruthy();
  });

  it('contentsがある場合はemptyMessage指定時でもメッセージを表示しない', () => {
    render(
      <ArticleCardList
        contents={[createBlogPost()]}
        emptyMessage="該当する記事が見つかりませんでした。"
      />,
    );
    expect(screen.queryByText('該当する記事が見つかりませんでした。')).toBeNull();
  });
});
