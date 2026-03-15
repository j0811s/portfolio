# Portfolio Site

Next.js (App Router) + MicroCMS で構築したポートフォリオサイト。

## 技術スタック

| カテゴリ | ライブラリ |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| CMS | MicroCMS |
| 認証 | NextAuth.js v4 |
| 状態管理 | Jotai |
| スタイル | CSS Modules (SCSS) |
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
AUTH_SECRET=
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
npm run lint         # ESLint チェック
npm run lint:fix     # ESLint 自動修正
npm run test         # ユニットテスト (Vitest)
npm run coverage     # カバレッジレポート
npm run e2e          # E2E テスト (Playwright)
npm run e2e:report   # Playwright HTML レポート表示
npm run e2e:codegen  # E2E テスト自動生成
```

## ページ構成

| パス | 説明 |
|---|---|
| `/` | トップページ（投稿一覧・スキル） |
| `/blog/` | ブログ記事一覧 |
| `/blog/[postId]/` | ブログ記事詳細 |
| `/blog/page/[num]/` | ページネーション |
| `/blog/categories/[catId]/` | カテゴリー別記事一覧 |
| `/blog/tags/[tagId]/` | タグ別記事一覧 |
| `/blog/archive/[year]/` | 年別アーカイブ |
| `/auth/` | ログイン |

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
│   ├── (logout)/         # 認証不要なページ (ログイン画面)
│   └── api/              # API ルート
├── features/             # 機能別コンポーネント
│   ├── blog/
│   ├── header/
│   ├── footer/
│   ├── theme/
│   └── skills/
├── components/           # 共通 UI コンポーネント
├── libs/                 # ユーティリティ
│   ├── microcms/         # MicroCMS クライアント
│   ├── blog/             # ブログヘルパー
│   └── seo/              # メタデータ生成
├── hooks/                # カスタムフック
├── stores/               # Jotai atoms
├── types/                # TypeScript 型定義
└── constants/            # 定数
```
