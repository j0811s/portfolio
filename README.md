# Portfolio Site

Next.js (App Router) + MicroCMS で構築したポートフォリオサイト。

## 技術スタック

| カテゴリ | ライブラリ |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| CMS | MicroCMS |
| API | Hono |
| 認証 | NextAuth.js v4 |
| メール送信 | Resend |
| フォーム | react-hook-form |
| 状態管理 | Jotai |
| スタイル | CSS Modules |
| フォント | next/font（M PLUS Rounded 1c / JetBrains Mono をビルド時に自己ホスト） |
| Lint / Format | Biome |
| ユニットテスト | Vitest |
| E2E テスト | Playwright |

## セットアップ

### 環境変数

`.env.local` を作成して以下を設定します。

```
MICROCMS_SERVICE_DOMAIN=
MICROCMS_API_KEY=
MICROCMS_HISTORY_SERVICE_DOMAIN=
MICROCMS_HISTORY_API_KEY=
SITE_URL=http://127.0.0.1:3000
GA_ID=
GTM_ID=
AUTH_USERNAME=
AUTH_PASSWORD=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

### 起動

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で起動します。

## コマンド

```bash
npm run dev          # 開発サーバー起動 (port 3000)
npm run build        # プロダクションビルド
npm run lint         # Biome lint チェック
npm run lint:fix     # Biome lint 自動修正
npm run format       # Biome フォーマット自動修正
npm run check        # Biome lint + format チェック
npm run test         # ユニットテスト (Vitest)
npm run coverage     # カバレッジレポート
npm run e2e          # E2E テスト (Playwright。毎回本番ビルドしてポート 3100 で起動)
npm run e2e:report   # Playwright HTML レポート表示
npm run e2e:codegen  # E2E テスト自動生成
```

## CI

`.github/workflows/check.yml` が PR と `main` への push（`src/`・`tests/`・依存や設定ファイルの変更時のみ）で `npm run check`（Biome lint + format）と `npm run test`（Vitest）を実行します。

`main` はリポジトリルールセットで保護されており、変更は PR 経由のみで、Check が通過していない PR はマージできません。

`.github/workflows/release.yml` が `main` へのマージ時に、前回の `v*` タグ以降のコミットの型（Conventional Commits）から次のバージョンを決めて GitHub Release を自動作成します（`feat` → minor、`fix` → patch、破壊的変更 → major、それ以外のみならリリースなし）。GitHub Actions の障害などで実行が取りこぼされた場合は、`gh workflow run release.yml` で手動で再実行できます。どの実行も実行時点の `main` の最新を基準にするため、リリース済みなら何もせず、遅れて動き出した古い実行とも重複しません。

## ページ構成

| パス | 説明 |
|---|---|
| `/` | トップページ（投稿一覧・スキル） |
| `/blog/` | ブログ記事一覧・検索・ページ送り（`?q=`・`?page=`） |
| `/blog/[postId]/` | ブログ記事詳細 |
| `/blog/page/[num]/` | `/blog/?page=[num]` へリダイレクト（旧ページネーションURL） |
| `/blog/categories/[catId]/` | カテゴリー別記事一覧 |
| `/blog/tags/[tagId]/` | タグ別記事一覧 |
| `/blog/archive/[year]/` | 年別アーカイブ |
| `/blog/search/` | `/blog/?q=` へリダイレクト（旧検索結果URL） |
| `/contact/` | お問い合わせフォーム |
| `/auth/` | ログイン |
| `/offline/` | オフライン時のフォールバックページ |
| `/sitemap.xml` | サイトマップ（自動生成）。ログイン必須で、未ログインには公開しない |
| `/robots.txt` | クローラー設定（自動生成）。未ログインでも取得でき、主要 AI クローラーはサイト全体を拒否 |
| `/manifest.webmanifest` | Web App Manifest（自動生成、PWAインストール可能化） |

## API ルート

`src/app/api/[[...route]]/route.ts` に Hono でまとめています。

| エンドポイント | 認証 | 説明 |
|---|---|---|
| `GET /api/draft` | — | プレビューモード有効化 |
| `GET /api/draft/disable` | — | プレビューモード解除 |
| `GET /api/blog` | — | ブログ一覧取得（`q`・`limit`・`offset`対応） |
| `GET /api/blog/:id` | — | ブログ記事詳細取得 |
| `GET /api/skills` | — | スキル一覧取得 |
| `POST /api/contact` | 必須 | お問い合わせメール送信（Resend） |

## MicroCMS プレビュー

MicroCMS の管理画面から下書きコンテンツをプレビューできます。

**設定手順：**

1. MicroCMS 管理画面で `API設定 > 画面プレビュー` を開く
2. 遷移先 URL に以下を設定する

```
https://your-domain.com/api/draft?id={CONTENT_ID}&draftKey={DRAFT_KEY}
```

プレビュー画面には「プレビューモードで表示中」バナーが表示され、バナー内のリンクからプレビューを終了できます。

## ディレクトリ構成

```
src/
├── app/                  # ページ・API ルート
│   ├── (login)/          # 認証が必要なページ
│   │   ├── blog/         # ブログ関連ページ
│   │   └── contact/      # お問い合わせページ
│   ├── (logout)/         # 認証不要なページ (ログイン画面)
│   ├── api/              # API ルート (Hono)
│   ├── offline/          # オフライン時のフォールバックページ
│   ├── sitemap.ts        # sitemap.xml 自動生成
│   ├── robots.ts         # robots.txt 自動生成
│   └── manifest.ts       # manifest.webmanifest 自動生成
├── features/             # 機能別コンポーネント
│   ├── blog/
│   ├── contact/          # お問い合わせフォーム (react-hook-form)
│   ├── header/
│   ├── footer/
│   ├── hero/
│   ├── theme/
│   ├── skills/
│   └── skeleton/
├── components/           # 共通 UI コンポーネント
├── libs/                 # ユーティリティ
│   ├── microcms/         # MicroCMS クライアント
│   ├── blog/             # ブログヘルパー
│   └── seo/              # メタデータ生成
├── hooks/                # カスタムフック
├── types/                # TypeScript 型定義
└── constants/            # 定数

scripts/
└── next-version.sh       # 自動リリース用: 前回タグ以降のコミットの型から次のバージョンを判定

tests/
├── unit/                 # Vitest
└── e2e/                  # Playwright
    └── guest/            # 未ログインで実行するテスト（認証ミドルウェアの対象外パス・robots.txt）。auth/page.spec.ts も未ログインで実行
```

`public/sw.js` — 手書きの Service Worker。`/_next/static/*` を cache-first、ページ遷移を network-first でキャッシュし、オフライン時は事前キャッシュ済みの `/offline/`（スタイル込み）にフォールバックする。プリキャッシュとランタイムキャッシュ（件数上限付き）を別キャッシュに分離している。
