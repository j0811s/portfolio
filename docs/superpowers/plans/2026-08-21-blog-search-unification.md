# 投稿一覧ページと検索ページの統合（検索寄り） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/blog/`を唯一のエントリーポイントとし、既存のライブ検索コンポーネント`SearchExperience`にページ送りも統合する。`/blog/search`・`/blog/page/[num]`は`/blog/`へのリダイレクトのみのルートに変える。

**Architecture:** `SearchExperience`に`page`状態を追加し、キーワード変更・ページ送りの両方を同じ`/api/blog`フェッチ機構で処理する。`Pagination`は`onPageChange`コールバックを受け取った場合のみ`<Link>`の代わりに`<button>`を描画する後方互換なオプトイン方式にし、アーカイブ・タグ・カテゴリページでの既存の実ページ遷移は変更しない。URL同期は前回同様`window.history.replaceState`のみを使い、Next.jsのナビゲーションを発生させない。

**Tech Stack:** Next.js App Router（`permanentRedirect`によるルートリダイレクト）、React（既存の`SearchExperience`パターンを拡張）、Hono API、Vitest、Playwright。

## Global Constraints

- URL同期には`window.history.replaceState`のみを使う。`next/navigation`の`router.replace`/`push`はURL同期用途では使わない（Server Componentの再実行と`loading.tsx`フォールバックの再発火を招くため）。
- `Pagination`の既存の`<Link>`ベース実装（アーカイブ・タグ・カテゴリページ向け）は一切変更しない。`onPageChange`はオプトインの追加機能とする。
- `/blog/page/[num]`・`/blog/search`のリダイレクトは`permanentRedirect`（308相当）を使う。
- `/blog/archive/[year]`・`/blog/tags/[tagId]`・`/blog/categories/[catId]`とそれぞれの`page/[num]`は今回のスコープ外。変更しない。
- `SearchExperience`はキーワード変更時に`page`を1にリセットする。ページ送りはデバウンスなしで即座に実行する。
- `/api/blog`エンドポイント自体への自動テストは追加しない（既存の方針を踏襲）。
- MicroCMSクエリの`fields: 'id,title,eyecatch,publishedAt,updatedAt'`指定は`/blog/page.tsx`・`/api/blog`の両方でそのまま維持する。
- 使われなくなる`SearchForm.tsx`とそのテストファイルは削除する（CSSモジュール`SearchForm.module.css`は`SearchExperience`が引き続き使うため残す）。

---

### Task 1: `GET /api/blog`に`offset`パラメータを追加

**Files:**
- Modify: `src/app/api/[[...route]]/route.ts`

**Interfaces:**
- Consumes: 既存の`fetchBlogList(endpoint?, queries?, customRequestInit?)`。`queries`は`{ q?: string; limit?: number; offset?: number; fields?: string }`を受け付ける。
- Produces: `GET /api/blog?q=<string>&limit=<number>&offset=<number>`が`{ contents: Blog[]; totalCount: number; limit: number; offset: number }`のJSONを返す。Task 3がこの`offset`パラメータを消費する。

- [ ] **Step 1: `route.ts`の`/blog`ハンドラーに`offset`を追加する**

`src/app/api/[[...route]]/route.ts`の`/blog`ハンドラーを以下に置き換える（他のハンドラーは変更しない）。

```ts
// ブログ一覧
app.get('/blog', async (c) => {
  const q = c.req.query('q');
  const limit = c.req.query('limit');
  const offset = c.req.query('offset');
  try {
    const data = await fetchBlogList('blog', {
      q: q || undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      fields: 'id,title,eyecatch,publishedAt,updatedAt',
    });
    return c.json(data);
  } catch {
    return c.json({ error: 'Not found' }, 404);
  }
});
```

- [ ] **Step 2: 型チェックとlintを確認する**

Run: `npx tsc --noEmit` および `npx biome check "src/app/api/[[...route]]/route.ts"`
Expected: 両方ともエラーなし。

- [ ] **Step 3: コミット**

```bash
git add "src/app/api/[[...route]]/route.ts"
git commit -m "feat: GET /api/blogにoffsetクエリパラメータを追加"
```

---

### Task 2: `Pagination`に`onPageChange`（ライブページ送り）を追加

**Files:**
- Modify: `src/features/blog/components/Pagination.tsx`
- Modify: `src/features/blog/styles/Pagination.module.css`
- Modify: `tests/unit/features/blog/components/Pagination.test.tsx`

**Interfaces:**
- Consumes: なし（既存コンポーネントの拡張）。
- Produces: `Pagination`の`Props`に`onPageChange?: (page: number) => void`を追加する。Task 3はこのpropを渡す。`onPageChange`が渡された場合、ページ番号は`<button type="button">`として描画される（`role="button"`、アクセシブルネームはページ番号の文字列）。渡されない場合は既存通り`<Link>`。

- [ ] **Step 1: 失敗するテストを書く**

`tests/unit/features/blog/components/Pagination.test.tsx`の末尾（`describe`ブロックの最後の`it`の後、`});`の直前）に以下を追加する。ファイル先頭のimportも変更する。

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '@/src/features/blog/components/Pagination';
```

（`fireEvent`を追加でimportする。既存の`vi.mock('next/link', ...)`以下は変更しない。）

追加するテスト:

```tsx
  it('onPageChangeが渡された場合はbuttonが描画されクリックでコールバックが呼ばれる', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        pager={{ totalCount: 30, limit: 10, currentPage: 1 }}
        onPageChange={onPageChange}
      />
    );
    const page2Button = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Button);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('onPageChangeが渡された場合は現在ページ以外にLinkが描画されない', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        pager={{ totalCount: 30, limit: 10, currentPage: 1 }}
        onPageChange={onPageChange}
      />
    );
    expect(screen.queryByRole('link', { name: '2' })).toBeNull();
  });
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `npx vitest run tests/unit/features/blog/components/Pagination.test.tsx`
Expected: 既存9テストはPASS、新規2テストがFAIL（`onPageChange`未対応のため常に`<Link>`が描画され、`getByRole('button', { name: '2' })`が見つからない）。

- [ ] **Step 3: `Pagination.tsx`を実装する**

`src/features/blog/components/Pagination.tsx`を以下の内容に置き換える。

```tsx
import styles from '@/src/features/blog/styles/Pagination.module.css';
import Link from 'next/link';

type PaginationParam = {
  pager: {
    totalCount: number;
    limit: number;
    currentPage?: number;
  };
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  };
  onPageChange?: (page: number) => void;
};

export default function Pagination({ pager, type, onPageChange }: PaginationParam) {
  const { totalCount, limit, currentPage = 1 } = pager;
  if (!totalCount) return;

  const pageCount: number[] = [...Array(Math.ceil(totalCount / limit)).keys()];

  const urlPath = !type?.slug ? '/blog/page/' : `/blog/${type?.slug}/${type?.id}/page/`;

  const currentPageCheck = (page: number): boolean => currentPage === page + 1;

  const renderPageLink = (page: number, label: number) => {
    if (onPageChange) {
      return (
        <button type="button" className={styles.pageLink} onClick={() => onPageChange(page)}>
          {label}
        </button>
      );
    }
    return (
      <Link className={styles.pageLink} href={`${urlPath}${page}`}>
        {label}
      </Link>
    );
  };

  const firstPageNumber = () => {
    if (3 >= currentPage) return null;
    return (
      <>
        <li className={`${styles.listItem}`}>{renderPageLink(1, 1)}</li>
        <li className={`${styles.listItem}`} style={{ pointerEvents: 'none' }}>
          <div className={`${styles.pageLink} ${styles.omit}`}>...</div>
        </li>
      </>
    );
  };

  const rangePageNumbers = pageCount.map((page) => {
    if (currentPage - 3 <= page && page <= currentPage + 1) {
      return (
        <li
          key={page}
          className={`${styles.listItem} ${currentPageCheck(page) ? currentPage : ''}`}
        >
          {currentPageCheck(page) ? (
            <div className={`${styles.currentText} ${styles.pageLink}`}>{page + 1}</div>
          ) : (
            renderPageLink(page + 1, page + 1)
          )}
        </li>
      );
    }
    return null;
  });

  const lastPageNumber = () => {
    if (currentPage + 2 < pageCount.length) {
      return (
        <>
          <li className={`${styles.listItem}`} style={{ pointerEvents: 'none' }}>
            <div className={`${styles.pageLink} ${styles.omit}`}>...</div>
          </li>
          <li className={`${styles.listItem}`}>
            {renderPageLink(pageCount.length, pageCount.length)}
          </li>
        </>
      );
    }
    return null;
  };

  return (
    <nav className={styles.container}>
      <ol className={styles.list}>
        {firstPageNumber()}
        {rangePageNumbers}
        {lastPageNumber()}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 4: `Pagination.module.css`に`<button>`向けのリセットを追加する**

`src/features/blog/styles/Pagination.module.css`の`.pageLink`ブロックを以下に置き換える（`<button>`要素に適用された際にブラウザデフォルトの枠線・フォントを打ち消し、`<Link>`と見た目を完全に一致させるため）。

```css
  .pageLink {
    position: relative;
    text-decoration: none;
    display: grid;
    place-content: center;
    width: 44px;
    height: 44px;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    border: none;
    border-radius: 10px;
    box-shadow: var(--neumorphism-shadow);
    font: inherit;
    cursor: pointer;
  }
```

- [ ] **Step 5: テストを実行して成功を確認する**

Run: `npx vitest run tests/unit/features/blog/components/Pagination.test.tsx`
Expected: PASS（11テスト全て）

- [ ] **Step 6: 型チェックとlintを確認する**

Run: `npx tsc --noEmit` および `npx biome check src/features/blog/`
Expected: 両方ともエラーなし。

- [ ] **Step 7: コミット**

```bash
git add src/features/blog/components/Pagination.tsx src/features/blog/styles/Pagination.module.css tests/unit/features/blog/components/Pagination.test.tsx
git commit -m "feat: Paginationにライブページ送り用のonPageChangeを追加"
```

---

### Task 3: `SearchExperience`をページ送り・一覧統合対応に拡張

**Files:**
- Modify: `src/features/blog/components/SearchExperience.tsx`
- Modify: `tests/unit/features/blog/components/SearchExperience.test.tsx`

**Interfaces:**
- Consumes: Task 1の`GET /api/blog`の`offset`パラメータ。Task 2の`Pagination`の`onPageChange?: (page: number) => void`。
- Produces: `SearchExperience`の`Props`が`{ initialKeyword: string; initialPage: number; initialContents: BlogPost[]; initialTotalCount: number }`になる（`initialPage`を新規追加）。Task 4はこの4つのpropsを渡す。`useRouter`/`push`への依存が無くなる。

**補足（設計判断）:**
リセットボタンは`/blog/search`が独立ページだった頃は`router.push('/blog/')`で実ページ遷移していたが、`/blog/`自体がこのコンポーネントになったため、キーワードを空にして`page`を1に戻し`runSearch('', 1)`を直接呼ぶだけでよい。これにより`next/navigation`の`useRouter`への依存自体が無くなる。`handleReset`は`setKeyword('')`の前に`previousKeywordRef.current = ''`を代入することで、`useEffect`が同じ変更を二重に検出してデバウンス経由の重複fetchを走らせることを防ぐ。

- [ ] **Step 1: 失敗するテストを書く**

`tests/unit/features/blog/components/SearchExperience.test.tsx`を以下の内容に**全体を置き換える**。

```tsx
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
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `npx vitest run tests/unit/features/blog/components/SearchExperience.test.tsx`
Expected: FAIL（`initialPage`が未対応のPropsエラー、ページ送り関連のアサーション失敗、リセット関連のアサーション失敗など、複数件）。

- [ ] **Step 3: `SearchExperience.tsx`を実装する**

`src/features/blog/components/SearchExperience.tsx`を以下の内容に**全体を置き換える**。

```tsx
'use client';

import styles from '@/src/features/blog/styles/SearchExperience.module.css';
import searchFormStyles from '@/src/features/blog/styles/SearchForm.module.css';
import ArticleCardList from '@/src/features/blog/components/ArticleCardList';
import Pagination from '@/src/features/blog/components/Pagination';
import { SectionTitle } from '@/src/components';
import { LIMIT } from '@/src/constants/blog';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

type Props = {
  initialKeyword: string;
  initialPage: number;
  initialContents: BlogPost[];
  initialTotalCount: number;
};

export default function SearchExperience({
  initialKeyword,
  initialPage,
  initialContents,
  initialTotalCount,
}: Props) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [page, setPage] = useState(initialPage);
  const [contents, setContents] = useState(initialContents);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const previousKeywordRef = useRef(initialKeyword);

  const runSearch = (value: string, targetPage: number) => {
    const trimmed = value.trim();
    const offset = (targetPage - 1) * LIMIT;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsFetching(true);
    setHasError(false);

    const apiParams = new URLSearchParams();
    if (trimmed) {
      apiParams.set('q', trimmed);
    }
    apiParams.set('limit', String(LIMIT));
    if (offset > 0) {
      apiParams.set('offset', String(offset));
    }

    fetch(`/api/blog?${apiParams.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`/api/blog responded ${res.status}`);
        }
        return res.json();
      })
      .then((data: { contents: BlogPost[]; totalCount: number }) => {
        setContents(data.contents);
        setTotalCount(data.totalCount);
        setIsFetching(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setIsFetching(false);
        setHasError(true);
      });

    const urlParams = new URLSearchParams();
    if (trimmed) {
      urlParams.set('q', trimmed);
    }
    if (targetPage > 1) {
      urlParams.set('page', String(targetPage));
    }
    const queryString = urlParams.toString();
    window.history.replaceState(null, '', queryString ? `/blog/?${queryString}` : '/blog/');
  };

  useEffect(() => {
    // previousKeywordRef (not a boolean flag) makes this guard idempotent under React
    // StrictMode's dev-mode double-invoked effects — see the StrictMode bugfix in this
    // branch's history for what breaks if this becomes a one-shot isFirstRender check.
    if (keyword === previousKeywordRef.current) {
      return;
    }
    previousKeywordRef.current = keyword;
    setPage(1);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      runSearch(keyword, 1);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [keyword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setPage(1);
    runSearch(keyword, 1);
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    previousKeywordRef.current = '';
    setKeyword('');
    setPage(1);
    runSearch('', 1);
  };

  const handlePageChange = (newPage: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setPage(newPage);
    runSearch(keyword, newPage);
  };

  const trimmedKeyword = keyword.trim();

  return (
    <section>
      <SectionTitle
        title={trimmedKeyword ? `「${trimmedKeyword}」の検索結果：${totalCount}件` : '投稿'}
      />
      <div aria-live="polite" className="sr-only">
        {totalCount}件の記事
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: <search>要素はReactのJSX型定義が未対応 */}
      <form className={searchFormStyles.form} onSubmit={handleSubmit} role="search">
        <input
          className={searchFormStyles.input}
          type="search"
          name="q"
          value={keyword}
          placeholder="キーワードで検索"
          aria-label="ブログ記事を検索"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span className={styles.indicator} data-fetching={isFetching} aria-hidden="true" />
        {keyword !== '' && (
          <button
            className={searchFormStyles.button}
            type="button"
            aria-label="リセット"
            onClick={handleReset}
          >
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </button>
        )}
        <button className={searchFormStyles.button} type="submit" aria-label="検索">
          <FontAwesomeIcon icon={faSearch} size="sm" />
        </button>
      </form>
      {hasError && (
        <p className={styles.error} role="status">
          検索に失敗しました。
        </p>
      )}
      <ArticleCardList
        contents={contents}
        emptyMessage={
          contents.length < 1
            ? trimmedKeyword
              ? `「${trimmedKeyword}」に一致する記事が見つかりませんでした。`
              : '記事が見つかりませんでした。'
            : undefined
        }
      />
      <Pagination
        pager={{ totalCount, limit: LIMIT, currentPage: page }}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
```

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `npx vitest run tests/unit/features/blog/components/SearchExperience.test.tsx`
Expected: PASS（13テスト全て）

- [ ] **Step 5: 型チェックとlintを確認する**

Run: `npx tsc --noEmit` および `npx biome check src/features/blog/`
Expected: 両方ともエラーなし。

- [ ] **Step 6: コミット**

```bash
git add src/features/blog/components/SearchExperience.tsx tests/unit/features/blog/components/SearchExperience.test.tsx
git commit -m "feat: SearchExperienceにページ送りを統合しuseRouter依存を除去"
```

---

### Task 4: `/blog/page.tsx`を統合ページとして書き換え、`/blog/loading.tsx`を新設

**Files:**
- Modify: `src/app/(login)/blog/page.tsx`
- Create: `src/app/(login)/blog/loading.tsx`

**Interfaces:**
- Consumes: Task 3の`SearchExperience`の`Props`（`{ initialKeyword: string; initialPage: number; initialContents: BlogPost[]; initialTotalCount: number }`）。既存の`@/src/components`の`LoadingSpinner`（`fullscreen?: boolean`、`docs/superpowers/plans/2026-08-16-search-ui-feedback.md`で追加済み）。
- Produces: `/blog/`が`?q=`・`?page=`を受け付ける統合ページになる。Task 5がこの`/blog/`を最終的なリダイレクト先として使う。

- [ ] **Step 1: `/blog/loading.tsx`を作成する**

`src/app/(login)/blog/loading.tsx`を新規作成する（既存の`src/app/(login)/blog/search/loading.tsx`と同じ構成）。

```tsx
import { LoadingSpinner } from '@/src/components';

export default function Loading() {
  return <LoadingSpinner fullscreen={false} />;
}
```

- [ ] **Step 2: `/blog/page.tsx`を実装する**

`src/app/(login)/blog/page.tsx`を以下の内容に置き換える。

```tsx
import styles from '@/src/styles/pages/blog/layout.module.css';
import { SITE_URL } from '@/src/constants/site';
import { LIMIT } from '@/src/constants/blog';
import { Breadcrumb } from '@/src/components';
import { fetchBlogList } from '@/src/libs/microcms/blog';
import { AsideMenu, SearchExperience } from '@/src/features/blog';
import type { Metadata } from 'next';
import { metadata as rootMetadata } from '@/src/app/layout';

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

const parsePage = (value: string | undefined): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, page } = await searchParams;
  const keyword = q?.trim() ?? '';
  const pageNum = parsePage(page);

  const title = keyword
    ? `「${keyword}」の検索結果`
    : pageNum > 1
      ? `${pageNum}ページ目 | 投稿`
      : '投稿';

  return {
    ...rootMetadata,
    title,
    description: `「投稿」の一覧ページです。`,
    openGraph: {
      description: `「投稿」の一覧ページです。`,
    },
    robots: keyword ? { index: false } : pageNum > 1 ? 'index, follow' : undefined,
    alternates: {
      canonical: !keyword && pageNum > 1 ? `/blog/?page=${pageNum}` : '/blog/',
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { q, page } = await searchParams;
  const keyword = q?.trim() ?? '';
  const pageNum = parsePage(page);

  const { contents, totalCount } = (await fetchBlogList('blog', {
    q: keyword || undefined,
    limit: LIMIT,
    offset: LIMIT * (pageNum - 1),
    fields: 'id,title,eyecatch,publishedAt,updatedAt',
  })) ?? { contents: [], totalCount: 0 };

  return (
    <>
      <Breadcrumb
        data={[
          { name: 'トップページ', url: SITE_URL },
          { name: '投稿', url: '/blog/' },
        ]}
      />
      <div className={styles.container}>
        <SearchExperience
          initialKeyword={keyword}
          initialPage={pageNum}
          initialContents={contents}
          initialTotalCount={totalCount}
        />
        <AsideMenu />
      </div>
    </>
  );
}
```

- [ ] **Step 3: 型チェックとlintを確認する**

Run: `npx biome check "src/app/(login)/blog/"`
Expected: エラーなし。

Run: `npx tsc --noEmit`
Expected: `src/app/(login)/blog/search/page.tsx`の`<SearchExperience initialKeyword={keyword} initialContents={contents} initialTotalCount={totalCount} />`呼び出しで、`initialPage`が渡されていないことによる型エラーが1件出る。これは想定内（このファイルはTask 5で`permanentRedirect`のみのファイルに書き換えられ、`SearchExperience`の呼び出し自体が無くなるため、Task 5完了まで解消しない既知の一時的な状態）。それ以外に新規のエラーが無いことを確認する。

- [ ] **Step 4: ビルドはここでは実行しない**

`/blog/search/page.tsx`がまだ`SearchExperience`の旧シグネチャ（`initialPage`無し）を呼んでいるため、Task 5でこのファイルを書き換えるまで`npm run build`は失敗する。このタスクでは`npm run build`を実行しない。フルビルドの成功確認はTask 5のStep 6で行う。

- [ ] **Step 5: コミット**

```bash
git add "src/app/(login)/blog/page.tsx" "src/app/(login)/blog/loading.tsx"
git commit -m "feat: /blog/を検索・ページ送り統合ページに書き換える"
```

---

### Task 5: `/blog/page/[num]`と`/blog/search`をリダイレクトルートに変換し、不要になったSearchFormを削除

**Files:**
- Modify: `src/app/(login)/blog/page/[num]/page.tsx`
- Modify: `src/app/(login)/blog/search/page.tsx`
- Delete: `src/app/(login)/blog/search/loading.tsx`
- Delete: `src/features/blog/components/SearchForm.tsx`
- Delete: `tests/unit/features/blog/components/SearchForm.test.tsx`
- Modify: `src/features/blog/index.ts`

**Interfaces:**
- Consumes: Task 4で`/blog/`が`?q=`・`?page=`を受け付けるようになっていること。
- Produces: なし（末端のルーティング変更）。

- [ ] **Step 1: `/blog/page/[num]/page.tsx`をリダイレクトのみに書き換える**

`src/app/(login)/blog/page/[num]/page.tsx`を以下の内容に置き換える。

```tsx
import { permanentRedirect } from 'next/navigation';

type Props = {
  params: Promise<{ num: string }>;
};

export default async function Page({ params }: Props) {
  const { num } = await params;
  if (num === '1') {
    permanentRedirect('/blog/');
  }
  permanentRedirect(`/blog/?page=${num}`);
}
```

- [ ] **Step 2: `/blog/search/page.tsx`をリダイレクトのみに書き換える**

`src/app/(login)/blog/search/page.tsx`を以下の内容に置き換える。

```tsx
import { permanentRedirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { q } = await searchParams;
  const keyword = q?.trim();
  if (keyword) {
    permanentRedirect(`/blog/?q=${encodeURIComponent(keyword)}`);
  }
  permanentRedirect('/blog/');
}
```

- [ ] **Step 3: `/blog/search/loading.tsx`を削除する**

```bash
rm "src/app/(login)/blog/search/loading.tsx"
```

- [ ] **Step 4: 不要になった`SearchForm`を削除する**

`SearchForm`の呼び出し元は本タスクのStep 1・2の変更により無くなる（Task 3の`SearchExperience`はCSSモジュール`SearchForm.module.css`のみを使い、コンポーネント自体は使わない）。

```bash
rm src/features/blog/components/SearchForm.tsx
rm tests/unit/features/blog/components/SearchForm.test.tsx
```

`src/features/blog/index.ts`から以下の行を削除する。

```ts
export { default as SearchForm } from '@/src/features/blog/components/SearchForm';
```

- [ ] **Step 5: 型チェック・lint・ユニットテスト全体を確認する**

Run: `npx tsc --noEmit` / `npx biome check src/` / `npx vitest run`
Expected: 全てエラーなし・PASS（`SearchForm`関連の参照が残っていないこと、削除したテストファイルがユニットテストの合計数から正しく除外されていることを確認する）。

- [ ] **Step 6: ビルドを確認する**

Run: `npm run build`
Expected: ビルド成功。`/blog/page/[num]`・`/blog/search`のルートサマリーがリダイレクト用の動的ルートになっていることを確認する。

- [ ] **Step 7: コミット**

```bash
git add "src/app/(login)/blog/page/[num]/page.tsx" "src/app/(login)/blog/search/page.tsx" src/features/blog/index.ts
git add -u "src/app/(login)/blog/search/loading.tsx" src/features/blog/components/SearchForm.tsx tests/unit/features/blog/components/SearchForm.test.tsx
git commit -m "feat: /blog/page/[num]・/blog/searchを/blog/へのリダイレクトに変換し不要なSearchFormを削除"
```

---

### Task 6: e2eテストの整理・統合

**Files:**
- Modify: `tests/e2e/blog/list.spec.ts`
- Modify: `tests/e2e/blog/search.spec.ts`

**Interfaces:**
- Consumes: Task 4・Task 5で完成した`/blog/`（ライブ検索・ライブページ送り）と`/blog/page/[num]`・`/blog/search`（リダイレクト）。

- [ ] **Step 1: `tests/e2e/blog/list.spec.ts`にライブ検索・ページ送りのテストを追加する**

`tests/e2e/blog/list.spec.ts`の末尾に以下を追加する。

```ts
test('検索キーワードを入力すると結果が絞り込まれる', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
  await page.waitForLoadState('networkidle');

  const input = page.getByPlaceholder('キーワードで検索');
  await input.fill('Next.js');

  await expect(page).toHaveURL(/\/blog\/\?q=Next\.js/);
  await expect(page.getByRole('heading', { name: /Next\.js/, level: 1 })).toBeVisible();
});

test('0件になるキーワードを入力すると空メッセージが表示される', async ({ page }) => {
  await page.goto('/blog/');
  await page.waitForLoadState('networkidle');

  const input = page.getByPlaceholder('キーワードで検索');
  await input.fill('zzzzzzzzzz-nonexistent-keyword-zzzzzzzzzz');

  await expect(page.getByText('に一致する記事が見つかりませんでした。')).toBeVisible();
});

test('ページ番号をクリックすると遷移せず次のページが表示される', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: '2' }).click();

  await expect(page).toHaveURL(/\/blog\/\?page=2/);
});

test('/blog/page/2/ は /blog/?page=2 へリダイレクトされる', async ({ page }) => {
  await page.goto('/blog/page/2/');

  await expect(page).toHaveURL(/\/blog\/\?page=2/);
});
```

- [ ] **Step 2: `tests/e2e/blog/search.spec.ts`をリダイレクト確認用に置き換える**

`tests/e2e/blog/search.spec.ts`を以下の内容に**全体を置き換える**（`/blog/search`自体はもうコンテンツを持たないため、既存の内容系テストは前のステップで`list.spec.ts`に移設済み）。

```ts
import { test, expect } from '@playwright/test';

test('/blog/search?q=X は /blog/?q=X へリダイレクトされ結果が表示される', async ({ page }) => {
  await page.goto('/blog/search?q=Next.js');

  await expect(page).toHaveURL(/\/blog\/\?q=Next\.js/);
  await expect(page.getByRole('heading', { name: /Next\.js/, level: 1 })).toBeVisible();
});

test('/blog/search（キーワードなし）は /blog/ へリダイレクトされる', async ({ page }) => {
  await page.goto('/blog/search');

  await expect(page).toHaveURL('/blog/');
});
```

- [ ] **Step 3: e2eテストを実行して成功を確認する**

まず開発サーバーを起動しウォームアップしてから実行する（`next dev`の初回コンパイルによる認証タイムアウトを避けるため）。

Run:
```bash
npm run dev &
# ポート3000がリッスンするまで待ち、/api/auth/sessionにNode fetchでアクセスしてウォームアップしてから:
npx playwright test tests/e2e/blog/
```
Expected: `list.spec.ts`・`search.spec.ts`とも全テストPASS。

- [ ] **Step 4: ユニットテスト・ビルドも含めて全体を最終確認する**

Run: `npm run check` / `npx vitest run` / `npm run build` / `npx playwright test`
Expected: 全てPASS。

- [ ] **Step 5: コミット**

```bash
git add tests/e2e/blog/list.spec.ts tests/e2e/blog/search.spec.ts
git commit -m "test: e2eテストを/blog/への統合に合わせて整理する"
```

---

## Self-Review

**1. Spec coverage:**
- 設計書「1. ルーティング構成の変更」→ Task 4（`/blog/`統合・`loading.tsx`新設）・Task 5（`/blog/page/[num]`・`/blog/search`のリダイレクト化）で実装。カバー済み。
- 設計書「2. SearchExperienceの拡張」（`initialPage`・`runSearch(value, page)`一般化・キーワード変更時のページリセット・ページ送り時の即時実行・URL同期・見出し・リセット簡略化）→ Task 3で実装。カバー済み。
- 設計書「3. Paginationコンポーネントの改修」（`onPageChange`のオプトイン追加、既存`<Link>`動作の維持）→ Task 2で実装。カバー済み。
- 設計書「4. SEO・メタデータ・リダイレクト」（タイトル出し分け・`robots`・`alternates.canonical`・`permanentRedirect`）→ Task 4（メタデータ）・Task 5（リダイレクト）で実装。カバー済み。
- 設計書「5. エラーハンドリング・エッジケース」（`page`パラメータの検証・空状態表示の拡張）→ Task 4（`parsePage`によるサーバー側検証）・Task 3（`emptyMessage`の拡張）で実装。カバー済み。
- 設計書「テスト・確認方法」の全項目 → Task 2・3（ユニットテスト）、Task 6（e2eテストの整理・統合）でカバー。
- ヒアリングで追加合意した「不要になった`SearchForm`の削除」→ Task 5に明記。
- スコープ外の項目（archive/tags/categoriesページへの適用、`fields`絞り込みの見直し）→ Global Constraintsに明記し、いずれのタスクにも実装を含めていない。

**2. プレースホルダースキャン:** 全タスクのコード・コマンドは実際の内容を記載済み。「TBD」「適切なエラーハンドリングを追加」等の曖昧な記述なし。

**3. 型・シグネチャの一貫性:** `SearchExperience`の`Props`（`initialKeyword`・`initialPage`・`initialContents`・`initialTotalCount`）はTask 3で定義し、Task 4は同じプロパティ名・型で呼び出している。`Pagination`の`onPageChange?: (page: number) => void`はTask 2で定義し、Task 3の`SearchExperience`が同じシグネチャで`handlePageChange`を渡している。`runSearch(value: string, targetPage: number)`という関数シグネチャはTask 3内で一貫して使われている（`useEffect`・`handleSubmit`・`handleReset`・`handlePageChange`いずれも同じ引数の順序・型で呼び出す）。`/api/blog`の`offset`パラメータ名はTask 1（サーバー側）とTask 3（クライアント側の`runSearch`）で一致している。
