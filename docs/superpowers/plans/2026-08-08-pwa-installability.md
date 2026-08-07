# PWA化（インストール可能化） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** サイトをホーム画面に追加してスタンドアロン起動できるようにする（Service Worker によるオフライン対応は含まない）。

**Architecture:** Next.js のファイル規約 `src/app/manifest.ts` で Web App Manifest を自動生成する（`sitemap.ts` / `robots.ts` と同じパターン）。既存ロゴから 192×192 アイコンを追加生成し、512×512 は既存の `public/logo.png` を流用する。認証ミドルウェア (`src/proxy.ts`) の matcher にマニフェストのパスを除外対象として追加し、未ログイン状態でもマニフェストが正しく取得できるようにする。さらに `layout.tsx` の `viewport` に OS のカラースキームに連動する `themeColor` を追加する。

**Tech Stack:** Next.js 16 (App Router) の Metadata API（`MetadataRoute.Manifest` / `Viewport` 型）、`sips`（macOS 標準の画像リサイズコマンド）。

## Global Constraints

- 設計書: `docs/superpowers/specs/2026-08-08-pwa-installability-design.md`
- Service Worker・オフライン対応・プッシュ通知は今回のスコープ外（実装しない）
- `curl` / `wget` は使用禁止。HTTP 疎通確認は Node.js の組み込み `fetch` を使うこと
- コミットメッセージや PR に絵文字は使わない
- 各タスク完了後、`git add` で対象ファイルのみをステージしてコミットする（`git add -A` は使わない）

---

### Task 1: PWA アイコン（192×192）の生成

**Files:**
- Create: `public/icon-192.png`

**Interfaces:**
- Consumes: `public/logo.png`（既存、512×512、確認済み）
- Produces: `public/icon-192.png`（192×192 の PNG）— Task 2 の `manifest.ts` がこのパスを参照する

このタスクはコードではなく画像アセットの生成のため、テストコードの代わりに寸法検証コマンドで確認する。

- [ ] **Step 1: 既存ロゴから 192×192 にリサイズしたアイコンを生成する**

```bash
sips -z 192 192 public/logo.png --out public/icon-192.png
```

- [ ] **Step 2: 生成したアイコンの寸法を確認する**

Run:
```bash
sips -g pixelWidth -g pixelHeight public/icon-192.png
```

Expected: `pixelWidth: 192` と `pixelHeight: 192` が出力される。

- [ ] **Step 3: コミット**

```bash
git add public/icon-192.png
git commit -m "feat: PWA用アイコン(192x192)を追加"
```

---

### Task 2: Web App Manifest の追加と認証ミドルウェアの除外設定

**Files:**
- Create: `src/app/manifest.ts`
- Modify: `src/proxy.ts:5-7`

**Interfaces:**
- Consumes:
  - `SITE_META`（`@/src/constants/site` からエクスポート）— `{ title: string, sitename: string, description: string, siteUrl: URL }`
  - `public/icon-192.png`（Task 1 で生成、192×192）
  - `public/logo.png`（既存、512×512）
- Produces: `/manifest.webmanifest` ルート（Next.js が自動生成、コード上の依存先はない）

このタスクもテストコードではなく、ビルドと実行時フェッチによる検証を行う（既存の `src/app/sitemap.ts` / `src/app/robots.ts` にも同種のユニットテストは存在せず、静的メタデータルートを実フェッチで確認するのがこのプロジェクトの既存の流儀）。

- [ ] **Step 1: `src/app/manifest.ts` を作成する**

```ts
import type { MetadataRoute } from 'next';
import { SITE_META } from '@/src/constants/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_META.title,
    short_name: SITE_META.title,
    description: SITE_META.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#e8eaf0',
    theme_color: '#ff7e0f',
    lang: 'ja',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

- [ ] **Step 2: `src/proxy.ts` の matcher に `manifest.webmanifest` を除外対象として追加する**

`src/proxy.ts:5-7` を以下に置き換える:

```ts
export const config = {
  matcher: '/((?!api|auth|manifest.webmanifest|_next/static|_next/image|favicon.ico).*)',
};
```

- [ ] **Step 3: Biome チェックを実行する**

Run:
```bash
npm run check
```

Expected: エラーなく完了する。

- [ ] **Step 4: ビルドして `/manifest.webmanifest` ルートが生成されることを確認する**

Run:
```bash
npm run build
```

Expected: ビルドが成功し、ルート一覧に `/manifest.webmanifest` が含まれる。

- [ ] **Step 5: 開発サーバーを起動し、未ログイン状態でマニフェストが正しく取得できることを確認する**

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
      if (json.name !== 'ポートフォリオサイト') throw new Error('unexpected name: ' + json.name);
      if (!Array.isArray(json.icons) || json.icons.length !== 4) {
        throw new Error('unexpected icons length: ' + (json.icons && json.icons.length));
      }
      console.log(JSON.stringify(json, null, 2));
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

（`npm run dev` は npm 経由で `next dev` を子プロセスとして起動するため、`$!` で取得できる PID を kill しても実サーバープロセスが残ることがある。`pkill -f "next dev"` で確実に停止させる。）

Expected: `status 200` の JSON が返り、`name` が `ポートフォリオサイト`、`icons` の要素数が `4` であることが確認できる（`redirect: 'manual'` を使うことで、もし matcher の除外が効いておらず `/auth` にリダイレクトされていた場合は 200 以外のステータスになり検知できる）。

- [ ] **Step 6: コミット**

```bash
git add src/app/manifest.ts src/proxy.ts
git commit -m "feat: Web App Manifestを追加しインストール可能にする"
```

---

### Task 3: `viewport.themeColor` の追加（OS カラースキーム連動）

**Files:**
- Modify: `src/app/layout.tsx:34-37`

**Interfaces:**
- Consumes: なし（既存の `Viewport` 型のみ使用）
- Produces: `<meta name="theme-color">` タグ（light/dark 2種）。他タスクからの依存はない。

- [ ] **Step 1: `viewport` export に `themeColor` を追加する**

`src/app/layout.tsx:34-37` を以下に置き換える:

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ff7e0f' },
    { media: '(prefers-color-scheme: dark)', color: '#3a7fa8' },
  ],
};
```

- [ ] **Step 2: ビルドして型エラーがないことを確認する**

Run:
```bash
npm run build
```

Expected: ビルドが成功する。

- [ ] **Step 3: 開発サーバーを起動し、`/auth/` のレスポンス HTML に light/dark 両方の `theme-color` メタタグが含まれることを確認する**

`/auth/` は認証不要の公開ページであり、ルートレイアウトを共有するため確認先として使う。

Run:
```bash
pkill -f "next dev" 2>/dev/null || true
npm run dev > /dev/null 2>&1 &
node -e "
(async () => {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/auth/');
      if (res.status !== 200) throw new Error('status ' + res.status);
      const html = await res.text();
      const hasLight = html.includes('theme-color') && html.includes('#ff7e0f');
      const hasDark = html.includes('#3a7fa8');
      if (!hasLight || !hasDark) {
        throw new Error('theme-color meta tags missing: light=' + hasLight + ' dark=' + hasDark);
      }
      console.log('OK: light and dark theme-color meta tags present');
      process.exit(0);
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  console.error('theme-color check failed after retries');
  process.exit(1);
})();
"
NODE_EXIT=$?
pkill -f "next dev" 2>/dev/null || true
exit $NODE_EXIT
```

Expected: `OK: light and dark theme-color meta tags present` が出力される。

- [ ] **Step 4: コミット**

```bash
git add src/app/layout.tsx
git commit -m "feat: OSのカラースキームに連動するtheme-colorを追加"
```

---

## Post-Plan Verification

全タスク完了後、以下を手動で確認する（自動化しない）:

- Chrome DevTools の Application タブ → Manifest で、名前・アイコン・`Installability` がエラーなく表示されること
- 実機またはデスクトップ Chrome で「アプリをインストール」操作ができること
