# PWA拡張（Shortcuts・オフライン対応） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ホーム画面ショートカット（`manifest.ts` の `shortcuts`）と、Service Worker による最小限のオフライン対応（静的アセットのみキャッシュ＋シンプルなフォールバックページ）を追加する。

**Architecture:** Shortcuts は既存の `src/app/manifest.ts` に配列を追加するだけ。オフライン対応は依存追加なしの手書き Service Worker（`public/sw.js`）を新設し、ナビゲーションは Network First（失敗時のみ `/offline` を返す）、`/_next/static/*` は Cache First とする。`/offline` と `/sw.js` は認証ミドルウェア（`src/proxy.ts`）の除外対象に追加する。

**Tech Stack:** Next.js 16 (App Router) の Metadata API、素の Service Worker API（Cache Storage API）、Playwright（`context.setOffline()`）。

## Global Constraints

- 設計書: `docs/superpowers/specs/2026-08-08-pwa-shortcuts-offline-design.md`
- 前提となる既存実装: `docs/superpowers/specs/2026-08-08-pwa-installability-design.md`（`src/app/manifest.ts`・`src/proxy.ts` の現状の除外リストはこの実装済みの内容）
- ブログ本文・API レスポンスのオフラインキャッシュは行わない（スコープ外）
- `_next/static` キャッシュの明示的な追い出し（LRU等）は実装しない
- `curl` / `wget` は使用禁止。HTTP疎通確認はNode.jsの組み込み`fetch`を使うこと
- コミットメッセージや PR に絵文字は使わない
- 各タスク完了後、`git add` で対象ファイルのみをステージしてコミットする（`git add -A` は使わない）
- CSS Modules はネスト構文を使わず、フラットなセレクターで記述する（既存の `src/styles/pages/*.module.css` の `@layer page { .selector { ... } }` 形式に合わせる）

---

### Task 1: Shortcuts（`manifest.ts` + スキルセクションのアンカー）

**Files:**
- Modify: `src/app/manifest.ts`
- Modify: `src/app/(login)/page.tsx:42`

**Interfaces:**
- Consumes: なし
- Produces: `/manifest.webmanifest` の `shortcuts` フィールド。`/#skills` アンカーの遷移先（`id="skills"`）。他タスクからの依存はない。

このタスクはコードではなく静的な設定・マークアップ変更のため、テストコードの代わりにビルド・実行時フェッチによる検証を行う（前回の PWA インストール可能化タスクと同じ流儀）。

- [ ] **Step 1: `src/app/manifest.ts` の `icons` の後に `shortcuts` を追加する**

現在の `src/app/manifest.ts` は以下の形（末尾の `icons` 配列の後）:

```ts
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

`icons` の閉じ `]` の直後（`};` の前）に以下を追加する:

```ts
    shortcuts: [
      { name: 'ブログ一覧', url: '/blog/' },
      { name: 'ブログ検索', url: '/blog/search/' },
      { name: 'スキル一覧', url: '/#skills' },
      { name: 'お問い合わせ', url: '/contact/' },
    ],
```

- [ ] **Step 2: `src/app/(login)/page.tsx:42` のスキルセクションに `id="skills"` を追加する**

`src/app/(login)/page.tsx:42-45` を以下に置き換える:

```tsx
      <section className={styles.section} id="skills">
        <SectionTitle title="経験" label="02" variant="editorial" level={2} />
        <SkillSet data={skills} />
      </section>
```

- [ ] **Step 3: Biome チェックを実行する**

Run:
```bash
npm run check
```

Expected: エラーなく完了する。

- [ ] **Step 4: ビルドする**

Run:
```bash
npm run build
```

Expected: ビルドが成功する。

- [ ] **Step 5: 開発サーバーを起動し、`/manifest.webmanifest` の `shortcuts` が期待通りであることを確認する**

`/manifest.webmanifest` は既に認証ミドルウェアの除外対象（前回実装済み）なので、未ログイン状態でも 200 で取得できる。

Run:
```bash
pkill -f "next dev" 2>/dev/null || true
npm run dev > /dev/null 2>&1 &
node -e "
(async () => {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/manifest.webmanifest', { redirect: 'manual' });
      if (res.status !== 200) throw new Error('status ' + res.status);
      const json = await res.json();
      const expected = [
        { name: 'ブログ一覧', url: '/blog/' },
        { name: 'ブログ検索', url: '/blog/search/' },
        { name: 'スキル一覧', url: '/#skills' },
        { name: 'お問い合わせ', url: '/contact/' },
      ];
      if (!Array.isArray(json.shortcuts) || json.shortcuts.length !== 4) {
        throw new Error('unexpected shortcuts length: ' + (json.shortcuts && json.shortcuts.length));
      }
      for (let j = 0; j < expected.length; j++) {
        if (json.shortcuts[j].name !== expected[j].name || json.shortcuts[j].url !== expected[j].url) {
          throw new Error('shortcut mismatch at index ' + j + ': ' + JSON.stringify(json.shortcuts[j]));
        }
      }
      console.log(JSON.stringify(json.shortcuts, null, 2));
      console.log('OK');
      process.exit(0);
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  console.error('manifest fetch failed after retries');
  process.exit(1);
})();
"
NODE_EXIT=$?
pkill -f "next dev" 2>/dev/null || true
exit $NODE_EXIT
```

Expected: `OK` が出力され、4件の shortcuts が期待した `name`/`url` と一致する。

`id="skills"` の追加は認証必須ページ（`/`）内の変更で、未ログイン状態のフェッチでは確認できない。ビルド成功と Step 2 のコード内容の目視確認（`id="skills"` が対象の `<section>` に付与されていること）で足りるものとし、この一行のマークアップ変更のためだけに認証済み Playwright テストは追加しない。

- [ ] **Step 6: コミット**

```bash
git add src/app/manifest.ts "src/app/(login)/page.tsx"
git commit -m "feat: PWAのshortcutsとスキルセクションへのアンカーを追加"
```

---

### Task 2: オフラインフォールバックページ

**Files:**
- Create: `src/app/offline/page.tsx`
- Create: `src/styles/pages/offline.module.css`
- Modify: `src/proxy.ts:5-7`

**Interfaces:**
- Consumes: なし（MicroCMS フェッチや共有ヘッダー/フッターに依存しない、独立した静的ページ）
- Produces: `/offline` ルート（200 で HTML を返す、未ログイン状態でも到達可能）。Task 3 の Service Worker がこの URL をプリキャッシュ対象にする。

**重要な設計判断:** このページのリンクは `next/link`（`CtaLinkButton` 等が内部で使用）ではなく素の `<a href="/">` を使う。`next/link` のクライアントサイド遷移は RSC ペイロード用の別種のフェッチを発行し、Task 3 の Service Worker の fetch ハンドラ（`navigate` モードのみを特別扱いする設計）ではカバーされない。オフライン時の信頼性を優先し、ブラウザ標準のフルページ遷移（JS 不要）にする。

- [ ] **Step 1: `src/styles/pages/offline.module.css` を作成する**

```css
@layer page {
  .container {
    display: grid;
    place-content: center;
    place-items: center;
    grid-template-columns: 1fr;
    height: 100%;
    min-height: 60vh;
    color: var(--text-primary);
    text-align: center;
    gap: 0.5rem;
  }

  .title {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .description {
    font-size: var(--font-size-m);
    opacity: 0.7;
    margin-bottom: 2rem;
  }

  .link {
    display: inline-block;
    padding: 0.75em 2em;
    border-radius: 9999px;
    background-color: var(--theme-primary);
    color: var(--white);
    text-decoration: none;
    font-weight: 700;
  }
}
```

- [ ] **Step 2: `src/app/offline/page.tsx` を作成する**

```tsx
import styles from '@/src/styles/pages/offline.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'オフライン',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className={styles.container}>
      <p className={styles.title}>オフラインです</p>
      <p className={styles.description}>接続を確認して再読み込みしてください。</p>
      <a className={styles.link} href="/">
        再読み込み
      </a>
    </div>
  );
}
```

- [ ] **Step 3: `src/proxy.ts` の matcher に `offline` を除外対象として追加する**

`src/proxy.ts:5-7`（現状、前回実装で `manifest.webmanifest|icon-192.png|logo.png` を含む）を以下に置き換える:

```ts
export const config = {
  matcher: '/((?!api|auth|manifest.webmanifest|icon-192.png|logo.png|offline|_next/static|_next/image|favicon.ico).*)',
};
```

- [ ] **Step 4: Biome チェックを実行する**

Run:
```bash
npm run check
```

Expected: エラーなく完了する。

- [ ] **Step 5: ビルドする**

Run:
```bash
npm run build
```

Expected: ビルドが成功し、ルート一覧に `/offline` が含まれる。

- [ ] **Step 6: 未ログイン状態で `/offline` が 200 で取得できることを確認する**

Run:
```bash
pkill -f "next dev" 2>/dev/null || true
npm run dev > /dev/null 2>&1 &
node -e "
(async () => {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/offline', { redirect: 'manual' });
      if (res.status !== 200) throw new Error('status ' + res.status);
      const html = await res.text();
      if (!html.includes('オフラインです')) throw new Error('expected text not found');
      const rootRes = await fetch('http://127.0.0.1:3000/', { redirect: 'manual' });
      const isRedirect = rootRes.status === 307 || rootRes.status === 302;
      if (!isRedirect) throw new Error('expected / to still redirect, got ' + rootRes.status);
      console.log('OK: /offline is 200, / still requires auth');
      process.exit(0);
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  console.error('offline page check failed after retries');
  process.exit(1);
})();
"
NODE_EXIT=$?
pkill -f "next dev" 2>/dev/null || true
exit $NODE_EXIT
```

Expected: `OK: /offline is 200, / still requires auth` が出力される。

- [ ] **Step 7: コミット**

```bash
git add src/app/offline/page.tsx src/styles/pages/offline.module.css src/proxy.ts
git commit -m "feat: オフラインフォールバックページを追加"
```

---

### Task 3: Service Worker（静的アセットキャッシュ + オフラインフォールバック）

**Files:**
- Create: `public/sw.js`
- Modify: `src/app/layout.tsx:12`（`themeInitScript` 定数の直後に `swRegisterScript` 定数を追加）と `src/app/layout.tsx:49-52`（`<head>` 内、既存の `<script>` タグの直後に登録用の `<script>` タグを追加）
- Modify: `src/proxy.ts:5-7`
- Create: `tests/e2e/offline/page.spec.ts`

**Interfaces:**
- Consumes:
  - `/offline`（Task 2 で作成済み、認証除外済み）
  - `/icon-192.png`（既存、認証除外済み）
- Produces: なし（末端の機能。他タスクからの依存はない）

このタスクは TDD で進める。Playwright の e2e テストを先に書き、Service Worker が存在しない状態で失敗する（RED）ことを確認してから実装する（GREEN）。

- [ ] **Step 1: 失敗する e2e テストを書く**

`tests/e2e/offline/page.spec.ts` を作成する:

```ts
import { test, expect } from '@playwright/test';

test('オフライン時にフォールバックページが表示される', async ({ page, context }) => {
  await page.goto('/');

  // Service Workerのインストールと/offlineのプリキャッシュ完了を待つ
  await page.waitForFunction(async () => {
    if (!('caches' in window)) return false;
    const cache = await caches.open('static-v1');
    const match = await cache.match('/offline');
    return !!match;
  });

  await context.setOffline(true);
  try {
    await page.goto('/');
    await expect(page.getByText('オフラインです')).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
```

- [ ] **Step 2: テストを実行して失敗することを確認する**

Run:
```bash
npx playwright test tests/e2e/offline/page.spec.ts
```

Expected: FAIL（`public/sw.js` がまだ存在しないため、`caches.open('static-v1').match('/offline')` が常に `undefined` を返し続け、`page.waitForFunction` がタイムアウトする）。

- [ ] **Step 3: `public/sw.js` を作成する**

```js
const CACHE_NAME = 'static-v1';
const OFFLINE_URL = '/offline';
const PRECACHE_URLS = [OFFLINE_URL, '/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  const url = new URL(request.url);
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
  }
});
```

- [ ] **Step 4: `src/app/layout.tsx` に Service Worker 登録スクリプトを追加する**

`src/app/layout.tsx` の `themeInitScript` 定数の直後に以下を追加する:

```ts
const swRegisterScript = `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}`;
```

`<head>` 内、既存の `themeInitScript` の `<script>` タグの直後に以下を追加する:

```tsx
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Service Worker登録の軽量インラインスクリプト */}
        <script dangerouslySetInnerHTML={{ __html: swRegisterScript }} />
```

- [ ] **Step 5: `src/proxy.ts` の matcher に `sw.js` を除外対象として追加する**

`src/proxy.ts:5-7`（Task 2 で `offline` を追加済みの状態）を以下に置き換える:

```ts
export const config = {
  matcher:
    '/((?!api|auth|manifest.webmanifest|icon-192.png|logo.png|offline|sw.js|_next/static|_next/image|favicon.ico).*)',
};
```

- [ ] **Step 6: Biome チェックを実行する**

Run:
```bash
npm run check
```

Expected: エラーなく完了する。

- [ ] **Step 7: ビルドする**

Run:
```bash
npm run build
```

Expected: ビルドが成功する。

- [ ] **Step 8: e2e テストを実行して成功することを確認する**

Run:
```bash
npx playwright test tests/e2e/offline/page.spec.ts
```

Expected: PASS。

- [ ] **Step 9: 未ログイン状態で `/sw.js` が 200 で取得できることを確認する**

Run:
```bash
pkill -f "next dev" 2>/dev/null || true
npm run dev > /dev/null 2>&1 &
node -e "
(async () => {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/sw.js', { redirect: 'manual' });
      if (res.status !== 200) throw new Error('status ' + res.status);
      const text = await res.text();
      if (!text.includes('CACHE_NAME')) throw new Error('unexpected sw.js content');
      console.log('OK: /sw.js is 200 and served correctly');
      process.exit(0);
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  console.error('sw.js check failed after retries');
  process.exit(1);
})();
"
NODE_EXIT=$?
pkill -f "next dev" 2>/dev/null || true
exit $NODE_EXIT
```

Expected: `OK: /sw.js is 200 and served correctly` が出力される。

- [ ] **Step 10: コミット**

```bash
git add public/sw.js src/app/layout.tsx src/proxy.ts tests/e2e/offline/page.spec.ts
git commit -m "feat: 静的アセットのみキャッシュするService Workerとオフラインe2eテストを追加"
```

---

## Post-Plan Verification

全タスク完了後、以下を手動で確認する（自動化しない）:

- Chrome DevTools の Application タブで Service Worker が登録され、「Offline」チェックボックスで実際にオフライン表示になること
- ホーム画面アイコンの長押し（Android）/ 右クリック（デスクトップ Chrome）で4つの shortcuts が表示されること
