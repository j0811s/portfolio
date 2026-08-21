import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StrictMode } from 'react';
import SearchExperience from '@/src/features/blog/components/SearchExperience';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

vi.mock('@/src/components', () => ({
  SectionTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('@/src/features/blog/components/ArticleCardList', () => ({
  default: ({
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

vi.mock('@/src/features/blog/components/Pagination', () => ({
  default: ({
    pager,
    onPageChange,
  }: {
    pager: { totalCount: number; limit: number; currentPage?: number };
    onPageChange?: (page: number) => void;
  }) => {
    const pageCount = Math.ceil(pager.totalCount / pager.limit);
    if (pageCount < 2) {
      return null;
    }
    return (
      <nav>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button key={p} type="button" onClick={() => onPageChange?.(p)}>
            {p}
          </button>
        ))}
      </nav>
    );
  },
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
    mockFetch.mockResolvedValue({
      ok: true,
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
        initialPage={1}
        initialContents={[createBlogPost({ title: '初期記事' })]}
        initialTotalCount={1}
      />
    );
    expect(screen.getByText('初期記事')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Next\.js/ })).toBeTruthy();
  });

  it('キーワードなしで0件の場合は「記事が見つかりませんでした。」が表示される', () => {
    render(
      <SearchExperience
        initialKeyword=""
        initialPage={1}
        initialContents={[]}
        initialTotalCount={0}
      />
    );
    expect(screen.getByText('記事が見つかりませんでした。')).toBeTruthy();
  });

  it('入力後300ms経過で正しいクエリを付けてfetchが呼ばれる', async () => {
    render(
      <SearchExperience
        initialKeyword=""
        initialPage={1}
        initialContents={[]}
        initialTotalCount={0}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Hono' },
    });

    expect(mockFetch).not.toHaveBeenCalled();

    await flush();

    expect(mockFetch).toHaveBeenCalledWith('/api/blog?q=Hono&limit=12', expect.anything());
  });

  it('fetch結果でcontents/totalCountが更新される', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          contents: [createBlogPost({ id: 'post-2', title: '新しい記事' })],
          totalCount: 1,
        }),
    });
    render(
      <SearchExperience
        initialKeyword=""
        initialPage={1}
        initialContents={[]}
        initialTotalCount={0}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Hono' },
    });

    await flush();

    expect(screen.getByText('新しい記事')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Hono.*：1件/ })).toBeTruthy();
  });

  it('入力を空にするとqなしでfetchし見出しが「投稿」に戻る', async () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    render(
      <SearchExperience
        initialKeyword="Next.js"
        initialPage={1}
        initialContents={[createBlogPost()]}
        initialTotalCount={1}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: '' },
    });

    await flush();

    expect(mockFetch).toHaveBeenCalledWith('/api/blog?limit=12', expect.anything());
    expect(screen.getByRole('heading', { name: '投稿' })).toBeTruthy();
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/blog/');
  });

  it('fetch失敗時は直前の結果を保持したままエラーメッセージが表示される', async () => {
    mockFetch.mockRejectedValue(new Error('network error'));
    render(
      <SearchExperience
        initialKeyword="Next.js"
        initialPage={1}
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

  it('fetchがHTTPエラーを返した場合も直前の結果を保持したままエラーメッセージが表示される', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });
    render(
      <SearchExperience
        initialKeyword="Next.js"
        initialPage={1}
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
    render(
      <SearchExperience
        initialKeyword=""
        initialPage={1}
        initialContents={[]}
        initialTotalCount={0}
      />
    );

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

  it('リセットボタンをクリックするとキーワードがクリアされ一覧に戻る', async () => {
    render(
      <SearchExperience
        initialKeyword="Next.js"
        initialPage={1}
        initialContents={[createBlogPost()]}
        initialTotalCount={1}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'リセット' }));

    expect((screen.getByPlaceholderText('キーワードで検索') as HTMLInputElement).value).toBe('');
    expect(mockFetch).toHaveBeenCalledWith('/api/blog?limit=12', expect.anything());
  });

  it('リセットボタンをデバウンス発火前にクリックすると保留中の検索の代わりに即座にクリアされる', async () => {
    render(
      <SearchExperience
        initialKeyword=""
        initialPage={1}
        initialContents={[]}
        initialTotalCount={0}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Hono' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'リセット' }));

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/blog?limit=12', expect.anything());

    await flush();

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('StrictMode下でマウントしてもキーワード未変更ならfetchが呼ばれない', async () => {
    render(
      <StrictMode>
        <SearchExperience
          initialKeyword="Next.js"
          initialPage={1}
          initialContents={[createBlogPost()]}
          initialTotalCount={1}
        />
      </StrictMode>
    );

    await flush();

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('ページ番号クリックで正しいoffset付きURLをfetchしURLに?page=が反映される', () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    render(
      <SearchExperience
        initialKeyword=""
        initialPage={1}
        initialContents={[createBlogPost()]}
        initialTotalCount={20}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(mockFetch).toHaveBeenCalledWith('/api/blog?limit=12&offset=12', expect.anything());
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/blog/?page=2');
  });

  it('キーワード変更でページが1にリセットされる', async () => {
    render(
      <SearchExperience
        initialKeyword=""
        initialPage={3}
        initialContents={[createBlogPost()]}
        initialTotalCount={40}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Hono' },
    });

    await flush();

    expect(mockFetch).toHaveBeenCalledWith('/api/blog?q=Hono&limit=12', expect.anything());
  });
});
