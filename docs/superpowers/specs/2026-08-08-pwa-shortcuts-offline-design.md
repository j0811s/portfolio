# PWA拡張（Shortcuts・オフライン対応） 設計書

日付: 2026-08-08
ステータス: 承認済み

## 背景と目的

[[2026-08-08-pwa-installability-design]] でインストール可能化（Web App Manifest・アイコン・`theme_color`）を実装済み。本設計はその続きとして、ホーム画面ショートカット（`manifest.ts` の `shortcuts`）と、Service Worker による最小限のオフライン対応の2つを追加する。

対象は個人利用の非公開サイト（`/auth` 以外は全ページ認証必須、`robots: noindex`）であるため、オフライン対応は「本文コンテンツのオフラインキャッシュ」までは踏み込まず、「静的アセットのみキャッシュし、オフライン時はシンプルなフォールバック画面を表示する」という最小スコープに留める。認証済みコンテンツのキャッシュは、ログアウト後のキャッシュ残留や共有端末での情報残留といったセキュリティ上の懸念があるため見送る。

## 変更内容

### 1. Shortcuts（`src/app/manifest.ts`）

既存の `manifest()` の戻り値に `shortcuts` を追加する。アイコンは指定しない（ランチャーはテキストのみ表示、MVPとして十分）。

```ts
shortcuts: [
  { name: 'ブログ一覧', url: '/blog/' },
  { name: 'ブログ検索', url: '/blog/search/' },
  { name: 'スキル一覧', url: '/#skills' },
  { name: 'お問い合わせ', url: '/contact/' },
],
```

`src/app/(login)/page.tsx` のスキルセクション（`<section className={styles.section}>` の2番目、`SkillSet` を含むもの）に `id="skills"` を追加し、`/#skills` のアンカー先を作る。

Android・デスクトップ Chrome ではホーム画面アイコンの長押し/右クリックメニューに表示される。iOS Safari は shortcuts 未対応だが、対応外として許容する。

### 2. オフライン対応（Service Worker）

#### 採用方式

比較検討した3案:

| 案 | 評価 |
|---|---|
| **手書き Service Worker（採用）** | 新規依存なし。ビルド時のプリキャッシュマニフェスト生成が不要で実装・監査がシンプル。今回のスコープ（静的アセットのみ・シンプルなフォールバック）に対して過不足がない。 |
| Serwist（`@serwist/next`） | Workbox ベースで実績があり、コンテンツハッシュ付きの正確なプリキャッシュを自動生成できる。将来より本格的なオフライン戦略（本文キャッシュ等）に拡張するなら有力だが、今回のスコープには機能過多かつ新規依存が増える。 |
| next-pwa | App Router との組み合わせでメンテナンス状況・互換性に不安があるため不採用。 |

#### キャッシュ戦略

- **ナビゲーション（ページ遷移、`request.mode === 'navigate'`）**: Network First。オフラインでフェッチが失敗した場合のみ、事前キャッシュ済みの `/offline` ページを返す。他ページの本文（ブログ記事等）は一切キャッシュしない。
- **`/_next/static/*`**: Cache First で実行時にキャッシュする。Next.js のコンテンツハッシュ付き不変ファイルであり、既にミドルウェアの認証除外対象（`src/proxy.ts` 変更不要）。
- **それ以外**（API、MicroCMS 画像、ページ本文の HTML 等）: キャッシュせず素通し（フェッチイベントを横取りしない）。

#### オフラインフォールバックページ

`src/app/offline/page.tsx` を新規作成。`(login)` / `(logout)` の両ルートグループ外（app ディレクトリ直下）に配置し、共有ヘッダー/フッターや MicroCMS フェッチに依存しない、独立した最小限のページにする。オフライン時でも確実に描画できることを優先する。

文面はシンプルに保つ：「オフラインです。接続を確認して再読み込みしてください」＋再読み込みボタンのみ。カスタム Web フォントは使わず、CSS のフォールバックでシステムフォントに任せる（フォントファイルのキャッシュ・認証除外という追加の複雑さを避けるため）。

#### 認証ミドルウェアの追加除外（`src/proxy.ts`）

`/offline` と `/sw.js` を matcher の除外対象に追加する。

```ts
export const config = {
  matcher:
    '/((?!api|auth|manifest.webmanifest|icon-192.png|logo.png|offline|sw.js|_next/static|_next/image|favicon.ico).*)',
};
```

除外しないと、Service Worker のインストール時（`/offline` のプリキャッシュ取得）や、未ログイン状態で `/auth` に滞在中の `sw.js` 取得・更新チェックが `/auth` へリダイレクトされ、JSON/JS ではなく HTML が返って壊れる（[[2026-08-08-pwa-installability-design]] の最終レビューで判明した問題と同種の失敗モード）。

#### Service Worker の登録

`src/app/layout.tsx` の既存の `themeInitScript` と同じ流儀で、`<script>` によるインライン登録を行う。クライアントコンポーネント化せず、追加の JS バンドルを増やさない。

```ts
const swRegisterScript = `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}`;
```

#### `public/sw.js` の実装方針

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
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
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

#### キャッシュのバージョニング

`CACHE_NAME` 定数を手動更新し、`activate` イベントで旧キャッシュを削除する簡易方式とする。`_next/static` キャッシュが無制限に増える可能性はあるが、個人ブログ規模の総アセット量では現実的なリスクではないため、明示的な追い出し（LRU等）は今回実装しない。

## テスト・確認方法

- **e2e（新規）**: Playwright で `page.context().setOffline(true)` を使い、「オフライン化 → ページ遷移 → `/offline` フォールバックが表示される」を1本追加する。このプロジェクトで初めて実挙動をテストできる形のPWA機能のため、既存の sitemap.ts/robots.ts/manifest.ts と異なりユニットテスト非対象という扱いはしない。
- 手動確認: Chrome DevTools の Application タブで Service Worker が登録され、「Offline」チェックボックスで実際にオフライン表示になることを確認する。
- shortcuts はビルド後に生成された `/manifest.webmanifest` の内容を確認する（前回同様、Node の `fetch` で確認。`curl`/`wget` は使わない）。

## スコープ外

- ブログ本文・API レスポンスのオフラインキャッシュ
- プッシュ通知（[[2026-08-08-pwa-installability-design]] から継続してスコープ外）
- `_next/static` キャッシュの明示的な追い出し・容量上限管理
- Service Worker のバックグラウンド同期・定期更新チェックの高度化
