# 検索結果のインクリメンタル更新 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/blog/search`ページに滞在中、入力するたびに（送信を待たずに）ページ遷移や`loading.tsx`のフォールバックを挟まず、検索結果をリアルタイムに更新する。

**Architecture:** `GET /api/blog`エンドポイントに`q`・`limit`クエリパラメータを追加し、既存の`fetchBlogList`にそのまま委譲する。`/blog/search`専用の新規Client Component `SearchExperience`が入力欄・結果一覧・見出しを内包し、入力のたびに300msデバウンスした上で`/api/blog`をfetchして結果を差し替える。URL同期は`next/navigation`の`router.replace`ではなく`window.history.replaceState`を使い、Next.jsのクライアントサイドナビゲーション（＝`search/page.tsx`の再実行、`loading.tsx`フォールバックの再発火）を発生させない。

**Tech Stack:** Next.js App Router（Hono APIレイヤー拡張）、React（`useState`/`useEffect`/`useRef`、`AbortController`によるリクエスト競合制御）、Vitest（フェイクタイマーによるデバウンステスト）、Playwright。

## Global Constraints

- `SearchForm.tsx`（`src/features/blog/components/SearchForm.tsx`）とそのCSSは**一切変更しない**。`/blog/`・`/blog/page/[num]`は今まで通り送信ベースの遷移を維持する。
- インクリメンタルサーチは`/blog/search`ページ滞在中のみ有効。他ページへの適用はスコープ外。
- URL同期には`window.history.replaceState`のみを使う。`next/navigation`の`router.replace`/`router.push`は**URL同期用途では使わない**（Server Componentの再実行と`loading.tsx`フォールバックの再発火を招くため）。リセットボタンによる`/blog/`への遷移は例外的に`router.push`を使う（実際のページ遷移が必要なため）。
- デバウンスは300ms固定。
- フェッチ中のフィードバックは入力欄横の小さなインジケータのみ。結果一覧・入力欄をdisabledにしない。
- `/api/blog`エンドポイント自体への自動テストは追加しない（既存API層に単体テストの前例がないため）。
- MicroCMSクエリの`fields`絞り込みによるペイロード削減は対象外。
- 全記事の先読み＋クライアント側絞り込みは対象外。
- 検索結果のキーワードハイライト表示・サジェスト機能は対象外。

---

### Task 1: `GET /api/blog`エンドポイントのクエリパラメータ対応

**Files:**
- Modify: `src/app/api/[[...route]]/route.ts`

**Interfaces:**
- Consumes: 既存の`fetchBlogList(endpoint?, queries?, customRequestInit?)`（`src/libs/microcms/blog.ts`）。`queries`は`{ q？: string; limit?: number }`を受け付ける。
- Produces: `GET /api/blog?q=<string>&limit=<number>`が`{ contents: Blog[]; totalCount: number; limit: number; offset: number }`のJSONを返す（`MicroCMSListResponse<Blog>`）。Task 2がこのレスポンスの`contents`・`totalCount`を消費する。

- [ ] **Step 1: `route.ts`を実装する**

`src/app/api/[[...route]]/route.ts`の既存の`/blog`ハンドラー（現在は`app.get('/blog', async (c) => { try { const data = await fetchBlogList(); ... }`）を以下に置き換える。他のハンドラー（`/draft`・`/blog/:id`・`/skills`・`/contact`等）は変更しない。

```ts
// ブログ一覧
app.get('/blog', async (c) => {
  const q = c.req.query('q');
  const limit = c.req.query('limit');
  try {
    const data = await fetchBlogList('blog', {
      q: q || undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return c.json(data);
  } catch {
    return c.json({ error: 'Not found' }, 404);
  }
});
```

- [ ] **Step 2: 型チェックとlintを確認する**

Run: `npx tsc --noEmit` および `npx biome check src/app/api/\[\[...route\]\]/route.ts`
Expected: 両方ともエラーなし。

- [ ] **Step 3: コミット**

```bash
git add "src/app/api/[[...route]]/route.ts"
git commit -m "feat: GET /api/blogにq・limitクエリパラメータを追加"
```

---

### Task 2: `SearchExperience`コンポーネントの新設

**Files:**
- Create: `src/features/blog/components/SearchExperience.tsx`
- Create: `src/features/blog/styles/SearchExperience.module.css`
- Modify: `src/features/blog/index.ts`（バレルエクスポート追加）
- Test: `tests/unit/features/blog/components/SearchExperience.test.tsx`

**Interfaces:**
- Consumes: Task 1の`GET /api/blog?q=...&limit=...`（`{ contents: BlogPost[]; totalCount: number }`を返す）。`ArticleCardList`の`{ contents: BlogPost[]; emptyMessage?: string }`（既存、変更なし）。`SectionTitle`の`{ title: string }`（既存、変更なし、`@/src/components`からimport）。グローバル型`BlogPost`。
- Produces: `SearchExperience`の`Props`は`{ initialKeyword: string; initialContents: BlogPost[]; initialTotalCount: number }`。Task 3はこの3つのpropsを渡す。

**補足（テスト設計上の注意）:**
デバウンス（`setTimeout`）と、その後のfetch（`Promise`が2段: `fetch()` → `res.json()` → `setState`）を`vi.useFakeTimers()`と組み合わせてテストする場合、`await vi.advanceTimersByTimeAsync(300)`だけでは2段目のPromiseチェーンとReactのstate更新が完了する前にアサーションに到達してしまう（このリポジトリのVitest 4.1.10 + React 19環境で実測済み）。`await vi.advanceTimersByTimeAsync(300)`の直後に`await vi.advanceTimersByTimeAsync(0)`を2回追加することで、保留中のマイクロタスクが確実に消化されアサーションが安定することを確認済み。

- [ ] **Step 1: 失敗するテストを書く**

`tests/unit/features/blog/components/SearchExperience.test.tsx`を新規作成する。

```tsx
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
      />,
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
      />,
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
      />,
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
});
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `npx vitest run tests/unit/features/blog/components/SearchExperience.test.tsx`
Expected: FAIL — `Cannot find module '@/src/features/blog/components/SearchExperience'`（まだ実装していないため）。

- [ ] **Step 3: `SearchExperience.tsx`を実装する**

`src/features/blog/components/SearchExperience.tsx`を新規作成する。

```tsx
'use client';

import styles from '@/src/features/blog/styles/SearchExperience.module.css';
import searchFormStyles from '@/src/features/blog/styles/SearchForm.module.css';
import { ArticleCardList } from '@/src/features/blog/';
import { SectionTitle } from '@/src/components';
import { LIMIT } from '@/src/constants/blog';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Props = {
  initialKeyword: string;
  initialContents: BlogPost[];
  initialTotalCount: number;
};

export default function SearchExperience({
  initialKeyword,
  initialContents,
  initialTotalCount,
}: Props) {
  const { push } = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [contents, setContents] = useState(initialContents);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const isFirstRender = useRef(true);

  const runSearch = (value: string) => {
    const trimmed = value.trim();

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsFetching(true);
    setHasError(false);

    const query = trimmed ? `?q=${encodeURIComponent(trimmed)}&limit=${LIMIT}` : `?limit=${LIMIT}`;

    fetch(`/api/blog${query}`, { signal: controller.signal })
      .then((res) => res.json())
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

    window.history.replaceState(
      null,
      '',
      trimmed ? `/blog/search?q=${encodeURIComponent(trimmed)}` : '/blog/search',
    );
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      runSearch(keyword);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    runSearch(keyword);
  };

  const handleReset = () => {
    push('/blog/');
  };

  const trimmedKeyword = keyword.trim();

  return (
    <section>
      <SectionTitle
        title={trimmedKeyword ? `「${trimmedKeyword}」の検索結果：${totalCount}件` : '検索'}
      />
      <div aria-live="polite" className={styles.visuallyHidden}>
        {trimmedKeyword ? `${totalCount}件の検索結果` : ''}
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
      {hasError && <p className={styles.error}>検索に失敗しました。</p>}
      <ArticleCardList
        contents={contents}
        emptyMessage={
          trimmedKeyword
            ? `「${trimmedKeyword}」に一致する記事が見つかりませんでした。`
            : undefined
        }
      />
    </section>
  );
}
```

- [ ] **Step 4: `SearchExperience.module.css`を作成する**

`src/features/blog/styles/SearchExperience.module.css`を新規作成する。

```css
@layer feature {
  .indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-left: 0.25em;
    border-radius: 50%;
    background-color: var(--theme-primary);
    visibility: hidden;
  }

  .indicator[data-fetching='true'] {
    visibility: visible;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }

  .error {
    margin-top: 0.5rem;
    font-size: var(--font-size-s);
    color: var(--error);
  }

  .visuallyHidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
```

- [ ] **Step 5: バレルエクスポートに追加する**

`src/features/blog/index.ts`の`SearchForm`エクスポートの直後に以下を追加する。

```ts
export { default as SearchExperience } from '@/src/features/blog/components/SearchExperience';
```

- [ ] **Step 6: テストを実行して成功を確認する**

Run: `npx vitest run tests/unit/features/blog/components/SearchExperience.test.tsx`
Expected: PASS（7テスト全て）

- [ ] **Step 7: 型チェックとlintを確認する**

Run: `npx tsc --noEmit` および `npx biome check src/features/blog/`
Expected: 両方ともエラーなし。

- [ ] **Step 8: コミット**

```bash
git add src/features/blog/components/SearchExperience.tsx src/features/blog/styles/SearchExperience.module.css src/features/blog/index.ts tests/unit/features/blog/components/SearchExperience.test.tsx
git commit -m "feat: 検索結果をリアルタイム更新するSearchExperienceを追加"
```

---

### Task 3: `search/page.tsx`への組み込みとe2eテスト

**Files:**
- Modify: `src/app/(login)/blog/search/page.tsx`
- Modify: `tests/e2e/blog/search.spec.ts`

**Interfaces:**
- Consumes: Task 2の`SearchExperience`の`Props`（`{ initialKeyword: string; initialContents: BlogPost[]; initialTotalCount: number }`）。

- [ ] **Step 1: 失敗するe2eテストを書く**

`tests/e2e/blog/search.spec.ts`の末尾に以下の2テストを追加する。

```ts
test('検索結果ページ滞在中に別キーワードを入力すると、ページ遷移なしに結果とURLが更新される', async ({
  page,
}) => {
  await page.goto('/blog/search?q=Next.js');
  await expect(page.getByRole('heading', { name: /Next\.js/, level: 1 })).toBeVisible();

  await page.getByPlaceholder('キーワードで検索').fill('Hono');

  await expect(page).toHaveURL(/\/blog\/search\/?\?q=Hono/);
  await expect(page.getByRole('heading', { name: /Hono/, level: 1 })).toBeVisible();
});

test('検索結果ページ滞在中に0件になるキーワードを入力すると空メッセージが表示される', async ({
  page,
}) => {
  await page.goto('/blog/search?q=Next.js');

  await page.getByPlaceholder('キーワードで検索').fill('zzzzzzzzzz-nonexistent-keyword-zzzzzzzzzz');

  await expect(page.getByText('に一致する記事が見つかりませんでした。')).toBeVisible();
});
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `npx playwright test tests/e2e/blog/search.spec.ts`
Expected: FAIL — 新規2テストがタイムアウトする（`search/page.tsx`がまだ`SearchExperience`を使っておらず、入力してもURL/結果が更新されないため）。既存9テストはPASSのまま。

- [ ] **Step 3: `search/page.tsx`を実装する**

`src/app/(login)/blog/search/page.tsx`を以下の内容に置き換える。

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
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    ...rootMetadata,
    title: q ? `「${q}」の検索結果` : '検索',
    robots: { index: false },
  };
}

export default async function Page({ searchParams }: Props) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? '';

  const { contents, totalCount } = (await fetchBlogList('blog', {
    q: keyword || undefined,
    limit: LIMIT,
  })) ?? { contents: [], totalCount: 0 };

  return (
    <>
      <Breadcrumb
        data={[
          { name: 'トップページ', url: SITE_URL },
          { name: '投稿', url: '/blog/' },
          { name: '検索', url: '/blog/search' },
        ]}
      />
      <div className={styles.container}>
        <SearchExperience
          initialKeyword={keyword}
          initialContents={contents}
          initialTotalCount={totalCount}
        />
        <AsideMenu />
      </div>
    </>
  );
}
```

`SectionTitle`・`SearchForm`・`ArticleCardList`のimportは`SearchExperience`に委譲したため削除し、代わりに`AsideMenu`と`SearchExperience`を`@/src/features/blog`バレルから、`Breadcrumb`のみを`@/src/components`から個別にimportする（`SectionTitle`はもう`page.tsx`側では使わない）。

- [ ] **Step 4: e2eテストを実行して成功を確認する**

Run: `npx playwright test tests/e2e/blog/search.spec.ts`
Expected: PASS（既存9テスト + 新規2テストの計11テスト全て）

- [ ] **Step 5: ユニットテスト・e2eテスト・ビルドを全体実行してリグレッションがないことを確認する**

Run: `npm run check` / `npx vitest run` / `npx playwright test` / `npm run build`
Expected: 全てPASS

- [ ] **Step 6: コミット**

```bash
git add "src/app/(login)/blog/search/page.tsx" tests/e2e/blog/search.spec.ts
git commit -m "feat: 検索結果ページにSearchExperienceを組み込む"
```

---

## Self-Review

**1. Spec coverage:**
- 設計書「1. `GET /api/blog`エンドポイントの拡張」→ Task 1で実装。カバー済み。
- 設計書「2. `SearchExperience`（新規Client Component）」（デバウンス・fetch・AbortController・`window.history.replaceState`によるURL同期・見出し・アクセシビリティのaria-live領域）→ Task 2で実装。カバー済み。
- 設計書「3. 微小インジケータのスタイル」→ Task 2のCSS(`SearchExperience.module.css`)でカバー。
- 設計書「エラーハンドリング・エッジケース」（fetch失敗・abort・同一キーワード再入力・JS無効環境・既存導線への非影響）→ Task 2の実装とテストでカバー（JS無効環境は仕様上「対応しない」ことの確認のみで実装は不要）。
- 設計書「テスト・確認方法」のユニットテスト6項目 → Task 2のテストで全てカバー。`/api/blog`自体の自動テストを追加しない方針 → Task 1にテストステップを含めていないことで反映。既存e2e7ケースへの非影響 → Task 3のStep 2で確認。新規e2e2ケース → Task 3のStep 1で追加。
- スコープ外の項目（Server Actions／全記事先読み／`fields`絞り込み／他ページへの適用／ハイライト・サジェスト）→ Global Constraintsに明記し、いずれのタスクにも実装を含めていない。

**2. プレースホルダースキャン:** 全タスクのコード・コマンドは実際の内容を記載済み。「TBD」「適切なエラーハンドリングを追加」等の曖昧な記述なし。

**3. 型・シグネチャの一貫性:** `SearchExperience`の`Props`（`initialKeyword: string; initialContents: BlogPost[]; initialTotalCount: number`）はTask 2で定義し、Task 3では同じプロパティ名・型で呼び出している。`/api/blog`のレスポンス形状（`{ contents: BlogPost[]; totalCount: number }`の部分を消費）はTask 1のレスポンス（`MicroCMSListResponse<Blog>`）とTask 2の`fetch`呼び出し側で一致している。`window.history.replaceState`の呼び出し形（第1引数`null`・第2引数`''`・第3引数がURL文字列）はTask 2の実装とテストで一致している。
