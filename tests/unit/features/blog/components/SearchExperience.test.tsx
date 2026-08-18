import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchExperience from '@/src/features/blog/components/SearchExperience';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/src/components', () => ({
  SectionTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('@/src/features/blog/', () => ({
  ArticleCardList: ({
    contents,
    emptyMessage,
  }: {
    contents: { id: string; title: string }[];
    emptyMessage?: string;
  }) => (
    <div>
      {contents.map((c) => (
        <div key={c.id}>{c.title}</div>
      ))}
      {contents.length < 1 && emptyMessage && <p>{emptyMessage}</p>}
    </div>
  ),
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

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

const flush = async () => {
  await vi.advanceTimersByTimeAsync(300);
  await vi.advanceTimersByTimeAsync(0);
  await vi.advanceTimersByTimeAsync(0);
};

describe('SearchExperience', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockReset();
    mockPush.mockReset();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ contents: [], totalCount: 0 }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期表示はinitialContents/initialTotalCountと一致する', () => {
    render(
      <SearchExperience
        initialKeyword="Next.js"
        initialContents={[createBlogPost({ title: '初期記事' })]}
        initialTotalCount={1}
      />
    );
    expect(screen.getByText('初期記事')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Next\.js/ })).toBeTruthy();
  });

  it('入力後300ms経過で正しいクエリを付けてfetchが呼ばれる', async () => {
    render(<SearchExperience initialKeyword="" initialContents={[]} initialTotalCount={0} />);
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Hono' },
    });

    expect(mockFetch).not.toHaveBeenCalled();

    await flush();

    expect(mockFetch).toHaveBeenCalledWith('/api/blog?q=Hono&limit=12', expect.anything());
  });

  it('fetch結果でcontents/totalCountが更新される', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          contents: [createBlogPost({ id: 'post-2', title: '新しい記事' })],
          totalCount: 1,
        }),
    });
    render(<SearchExperience initialKeyword="" initialContents={[]} initialTotalCount={0} />);
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Hono' },
    });

    await flush();

    expect(screen.getByText('新しい記事')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Hono.*：1件/ })).toBeTruthy();
  });

  it('入力を空にするとqなしでfetchし見出しが「検索」に戻る', async () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    render(
      <SearchExperience
        initialKeyword="Next.js"
        initialContents={[createBlogPost()]}
        initialTotalCount={1}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: '' },
    });

    await flush();

    expect(mockFetch).toHaveBeenCalledWith('/api/blog?limit=12', expect.anything());
    expect(screen.getByRole('heading', { name: '検索' })).toBeTruthy();
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/blog/search');
  });

  it('fetch失敗時は直前の結果を保持したままエラーメッセージが表示される', async () => {
    mockFetch.mockRejectedValue(new Error('network error'));
    render(
      <SearchExperience
        initialKeyword="Next.js"
        initialContents={[createBlogPost({ title: '保持される記事' })]}
        initialTotalCount={1}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Hono' },
    });

    await flush();

    expect(screen.getByText('保持される記事')).toBeTruthy();
    expect(screen.getByText('検索に失敗しました。')).toBeTruthy();
  });

  it('連続入力時は古いリクエストのAbortControllerがabortされる', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<SearchExperience initialKeyword="" initialContents={[]} initialTotalCount={0} />);

    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'H' },
    });
    await flush();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(abortSpy).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Ho' },
    });
    await flush();

    expect(abortSpy).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('リセットボタンで/blog/へ遷移する', () => {
    render(
      <SearchExperience
        initialKeyword="Next.js"
        initialContents={[createBlogPost()]}
        initialTotalCount={1}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'リセット' }));
    expect(mockPush).toHaveBeenCalledWith('/blog/');
  });
});
