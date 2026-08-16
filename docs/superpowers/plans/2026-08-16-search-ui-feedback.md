# 検索UI改善（実行中フィードバック・0件表示） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 検索結果ページ専用の`loading.tsx`を追加して遷移中の視覚的フィードバックを提供し、検索結果0件時に専用のメッセージを表示することで、「検索中のUIがわかりづらい」という問題を解消する。

**Architecture:** `src/app/(login)/blog/search/`直下に`loading.tsx`を新設し、`/blog/search`への遷移用のSuspense境界をルート直下の`src/app/loading.tsx`（`GlobalHeader`/`GlobalFooter`ごと全画面スピナーに置き換わる）から検索ページ自身に狭める。`ArticleCardList`（表示コンポーネント）にオプトインの`emptyMessage` propを追加し、検索結果ページ（`/blog/search`）のみが0件時にメッセージを渡す。両者は独立しており、`ArticleCardList`の他6箇所の呼び出し元は挙動が変わらない。`SearchForm.tsx`自体への変更は行わない（理由は「設計変更の経緯」を参照）。

**Tech Stack:** Next.js App Router（`loading.tsx`ファイル規約によるSuspenseフォールバック）、CSS Modules（`@layer feature`）、Vitest + Testing Library、Playwright。

## 設計変更の経緯

当初の設計書は`SearchForm.tsx`に`useTransition`を導入し`router.push`を`startTransition`でラップして`isPending`でdisabled/スピナー表示を制御する案だったが、実装計画作成中の検証で機能しないことが判明した。React 19.2.3の`startTransition`実装（`react-dom/cjs/react-dom-client.development.js`）は、コールバックの**戻り値がPromiseの場合のみ**その解決を待って`isPending`を`false`に戻す。`useRouter().push()`は`void`を返すため、`isPending`は実際のナビゲーション完了を待たず同期的に`false`へ戻ってしまい、スピナーが実質機能しない。Next.js公式ドキュメント（`node_modules/next/dist/docs/`）でも`router.push`に対する`isPending`相当の公式パターンは存在せず、動的ルートの遷移フィードバックとして明示的に推奨されているのは`loading.tsx`である。この検証結果をユーザーに提示し、`loading.tsx`方式を採用する判断を得た（詳細は`docs/superpowers/specs/2026-08-10-search-ui-feedback-design.md`の「改訂履歴」を参照）。

## Global Constraints

- `ArticleCardList`の`emptyMessage`はオプトインpropとし、既存の呼び出し元6箇所（トップページ・ブログ一覧・アーカイブ・タグ・カテゴリの各ページ）の挙動（0件時は`null`を返す）を変更しない。
- 検索結果カードのスケルトン表示（`loading.tsx`内でカード形状のプレースホルダーを描画する等）は対象外。既存の`LoadingSpinner`を流用するに留める。
- デバウンス・インクリメンタルサーチ（`useDeferredValue`等によるクライアントサイド絞り込み）は対象外。現行のフォーム送信ベースの設計を維持する。
- 検索結果のキーワードハイライト表示・サジェスト機能は対象外。
- `ArticleCardList`の他の呼び出し元（一覧・アーカイブ・タグ・カテゴリページ）への`emptyMessage`適用は対象外。
- `SearchForm.tsx`への変更は行わない（`useTransition`案は撤回済み）。

---

### Task 1: 検索結果ページ専用の`loading.tsx`を追加

**Files:**
- Create: `src/app/(login)/blog/search/loading.tsx`

**Interfaces:**
- Consumes: `@/src/components`バレル経由の`LoadingSpinner`（既存コンポーネント、props無し）。
- Produces: 他タスクが依存するエクスポートはなし（Next.jsのファイル規約によるSuspenseフォールバックで、どこからもimportされない）。

**補足（テストについて）:**
`loading.tsx`はNext.jsのファイル規約に基づくSuspenseフォールバックであり、既存のルート直下`src/app/loading.tsx`にも自動テスト（ユニット・e2eとも）が存在しない。今回追加する`search/loading.tsx`も同じ理由でVitest/Playwrightいずれの自動テスト対象にもしない。ローカルでの動作確認は「動作確認（手動）」の節を参照。

- [ ] **Step 1: `src/app/(login)/blog/search/loading.tsx`を作成する**

`src/app/loading.tsx`（既存のルート直下版）と同一の構成にする。

```tsx
import { LoadingSpinner } from '@/src/components';

export default function Loading() {
  return <LoadingSpinner />;
}
```

- [ ] **Step 2: ビルドが通ることを確認する**

Run: `npm run build`
Expected: ビルド成功。`/blog/search`のルートサマリーに変化がないこと（新しい`loading.tsx`はページ自体を増やさない）を確認する。

- [ ] **Step 3: コミット**

```bash
git add "src/app/(login)/blog/search/loading.tsx"
git commit -m "feat: 検索結果ページ専用のloading.tsxを追加"
```

---

### Task 2: ArticleCardList — `emptyMessage` propの追加

**Files:**
- Modify: `src/features/blog/components/ArticleCardList.tsx`
- Modify: `src/features/blog/styles/ArticleCardList.module.css`
- Create: `tests/unit/features/blog/components/ArticleCardList.test.tsx`

**Interfaces:**
- Consumes: グローバル型`BlogPost`（`src/types/global.d.ts`で宣言済み。最小フィールドは`id, title, content, category: [], tag: [], createdAt, updatedAt, url`）。バレルエクスポート`@/src/features/blog/`経由の`ArticleCard`コンポーネント。
- Produces: `ArticleCardList`の`Props`に`emptyMessage?: string`を追加する。Task 3はこの`emptyMessage?: string`propを`ArticleCardList`に渡す。

**補足（テスト設計上の注意）:**
`ArticleCard`は内部で`next/image`を使う`Eyecatch`を描画するが、このリポジトリには`next/image`をレンダリングするコンポーネントを単体テストする既存パターンがない。今回のテストは`emptyMessage`の描画有無のみを検証すればよいため、バレル`@/src/features/blog/`経由で`ArticleCard`をモックしてスコープを絞る（実測で`vi.mock('@/src/features/blog/', ...)`のパス解決・0件時に`null`を返す既存挙動・非0件時の描画が正しく動作することを確認済み）。

- [ ] **Step 1: 失敗するテストを書く**

`tests/unit/features/blog/components/ArticleCardList.test.tsx`を新規作成する。

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArticleCardList from '@/src/features/blog/components/ArticleCardList';

vi.mock('@/src/features/blog/', () => ({
  ArticleCard: ({ title }: { title: string }) => <div>{title}</div>,
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
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `npx vitest run tests/unit/features/blog/components/ArticleCardList.test.tsx`
Expected: 4テスト中1テスト（`contentsが空でemptyMessage指定時はメッセージを表示する`）がFAIL。エラー内容は`Unable to find an element with the text: 該当する記事が見つかりませんでした。`。他の3テストはこの時点で既にPASSする（既存の非0件描画・0件時`null`描画の挙動は変更しないため）。

- [ ] **Step 3: `ArticleCardList.tsx`を実装する**

`src/features/blog/components/ArticleCardList.tsx`を以下の内容に置き換える。

```tsx
import clsx from 'clsx';
import styles from '@/src/features/blog/styles/ArticleCardList.module.css';
import { ArticleCard } from '@/src/features/blog/';

interface Props {
  contents: BlogPost[];
  className?: string;
  emptyMessage?: string;
}

export default function ArticleCardList({ contents, className = '', emptyMessage }: Props) {
  if (contents.length < 1) {
    return emptyMessage ? <p className={styles.empty}>{emptyMessage}</p> : null;
  }

  return (
    <ul className={clsx(styles.list, className)}>
      {contents.map((content) => (
        <li className={styles.item} key={content.id}>
          <ArticleCard {...content} />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: `ArticleCardList.module.css`に`.empty`スタイルを追加する**

`src/features/blog/styles/ArticleCardList.module.css`の`.item`ブロックの直後（`@supports`ブロックの前）に以下を追加する。

```css
  .empty {
    margin-top: 2.5rem;
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--text-secondary, #999);
  }
```

- [ ] **Step 5: テストを実行して成功を確認する**

Run: `npx vitest run tests/unit/features/blog/components/ArticleCardList.test.tsx`
Expected: PASS（4テスト全て）

- [ ] **Step 6: コミット**

```bash
git add src/features/blog/components/ArticleCardList.tsx src/features/blog/styles/ArticleCardList.module.css tests/unit/features/blog/components/ArticleCardList.test.tsx
git commit -m "feat: ArticleCardListに0件時のemptyMessage表示を追加"
```

---

### Task 3: 検索結果ページへの結線とe2eテスト

**Files:**
- Modify: `src/app/(login)/blog/search/page.tsx`
- Modify: `tests/e2e/blog/search.spec.ts`

**Interfaces:**
- Consumes: Task 2で追加した`ArticleCardList`の`emptyMessage?: string`プロパティ。
- Produces: 他タスクが依存するエクスポートはなし（アプリケーションのルートページ）。

- [ ] **Step 1: 失敗するe2eテストを書く**

`tests/e2e/blog/search.spec.ts`の末尾に以下のテストを追加する。

```ts
test('検索結果が0件のとき空メッセージが表示される', async ({ page }) => {
  await page.goto('/blog/search?q=zzzzzzzzzz-nonexistent-keyword-zzzzzzzzzz');

  await expect(page.getByText('に一致する記事が見つかりませんでした。')).toBeVisible();
});
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `npx playwright test tests/e2e/blog/search.spec.ts`
Expected: FAIL — 新規テストが、メッセージ要素が存在せずタイムアウトする（`page.tsx`がまだ`emptyMessage`を渡していないため）。既存7テストはPASSのまま。

- [ ] **Step 3: `search/page.tsx`を実装する**

`src/app/(login)/blog/search/page.tsx`の`<ArticleCardList contents={contents} />`を以下に置き換える（他の箇所は変更しない）。

```tsx
            <ArticleCardList
              contents={contents}
              emptyMessage={
                keyword ? `「${keyword}」に一致する記事が見つかりませんでした。` : undefined
              }
            />
```

変更後のファイル全体は以下の通り。

```tsx
import styles from '@/src/styles/pages/blog/layout.module.css';
import { SITE_URL } from '@/src/constants/site';
import { LIMIT } from '@/src/constants/blog';
import { Breadcrumb, SectionTitle } from '@/src/components';
import { fetchBlogList } from '@/src/libs/microcms/blog';
import { ArticleCardList, AsideMenu } from '@/src/features/blog';
import SearchForm from '@/src/features/blog/components/SearchForm';
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
        <section>
          <SectionTitle title={keyword ? `「${keyword}」の検索結果：${totalCount}件` : '検索'} />
          <SearchForm defaultValue={keyword} />
          <ArticleCardList
            contents={contents}
            emptyMessage={
              keyword ? `「${keyword}」に一致する記事が見つかりませんでした。` : undefined
            }
          />
        </section>
        <AsideMenu />
      </div>
    </>
  );
}
```

- [ ] **Step 4: e2eテストを実行して成功を確認する**

Run: `npx playwright test tests/e2e/blog/search.spec.ts`
Expected: PASS（既存7テスト + 新規1テストの計8テスト全て）

- [ ] **Step 5: ユニットテスト・e2eテストを全体実行してリグレッションがないことを確認する**

Run: `npm run test -- --run` および `npm run e2e`
Expected: 両方ともPASS

- [ ] **Step 6: コミット**

```bash
git add "src/app/(login)/blog/search/page.tsx" tests/e2e/blog/search.spec.ts
git commit -m "feat: 検索結果0件時にemptyMessageを表示する"
```

---

## 動作確認（手動）

自動テストの対象外である`loading.tsx`の表示は、実装後にログイン済みブラウザで以下を確認する。

1. `npm run dev`で開発サーバーを起動し、ログインする。
2. `/blog/`から任意のキーワードで検索し、`GlobalHeader`・`GlobalFooter`が表示されたまま、検索結果の表示領域だけが一瞬`LoadingSpinner`に切り替わり、結果ページが表示されることを確認する（ネットワークが速い場合は一瞬で切り替わり気づきにくいため、必要であればブラウザDevToolsのNetwork throttlingでSlow 3G相当に落として確認する）。
3. 存在しないキーワードで検索し、「「〈キーワード〉」に一致する記事が見つかりませんでした。」というメッセージが表示されることを確認する。

## Self-Review

**1. Spec coverage:**
- 設計書「1. `src/app/(login)/blog/search/loading.tsx` — 検索専用ローディングUIの追加」→ Task 1で実装。カバー済み。
- 設計書「2. `ArticleCardList.tsx` — `emptyMessage` propの追加」→ Task 2で実装。カバー済み。
- 設計書「`search/page.tsx`側でキーワードがある場合のみ`emptyMessage`を渡す」→ Task 3で実装。カバー済み。
- 設計書「テスト・確認方法」のユニットテスト（`ArticleCardList.test.tsx`新規）→ Task 2でカバー。`loading.tsx`は自動テスト対象外である旨をTask 1の補足と本プラン末尾の「動作確認（手動）」に明記。
- スコープ外の5項目（結果カードのスケルトン表示／デバウンス／ハイライト・サジェスト／他6箇所へのemptyMessage適用／`SearchForm.tsx`変更なし）→ Global Constraintsに明記し、いずれのタスクにも実装を含めていない。

**2. プレースホルダースキャン:** 全タスクのコード・コマンドは実際の内容を記載済み。「TBD」「適切なエラーハンドリングを追加」等の曖昧な記述なし。

**3. 型・シグネチャの一貫性:** `ArticleCardList`の`Props`（`emptyMessage?: string`）はTask 2で定義し、Task 3ではまったく同じプロパティ名・型で呼び出している。`BlogPost`型はTask 2のテストで`src/types/global.d.ts`のグローバル宣言と一致するフィールド（`id, title, content, category: [], tag: [], createdAt, updatedAt, url`）を使用している。Task 1の`loading.tsx`は他タスクのコードから参照されないため、シグネチャの整合性に関わる依存はない。
