# CLAUDE.md

このファイルはリポジトリ内で作業する Claude Code (claude.ai/code) へのガイダンスを提供します。

## ファイル編集後のワークフロー

### `src/`配下にあるファイル編集後

以下の順で必ず実行すること：

1. `/pre-push` スキルが利用可能な場合は優先して実行する（ステップ1〜4を自動化）。利用できない場合は以下を手動で実行：
   1. `git status`,`git add -A`を実行（`git commit`は実行しない）
   2. `npm run check`を実行し、エラーが出たら修正を提案する（不要なら省略可）
   3. `npm run build`を実行し、エラーが出たら修正を提案する（不要なら省略可）
   4. 必要なら`test/`にユニットテストとE2Eテストを作成し、`npm run test`と`npm run e2e`を実行する
2. 追加・変更した機能に合わせて `CLAUDE.md` と `README.md` を更新（不要なら省略可）
3. `/difit-review` でコードレビューを実施（必須）

### `test/`配下にあるファイル編集後

以下の順で必ず実行すること：

1. `git status`,`git add -A`を実行（`git commit`は実行しない）
2. `npm run test`と`npm run e2e`を実行する
3. 追加・変更した機能に合わせて `CLAUDE.md` と `README.md` を更新（不要なら省略可）
4. `/difit-review` でコードレビューを実施

## コマンド

```bash
npm run dev          # 開発サーバー起動 (ポート3000)
npm run build        # 本番ビルド
npm run lint         # Biome lint チェック (src/)
npm run lint:fix     # Biome lint 自動修正 (src/)
npm run format       # Biome フォーマット自動修正 (src/)
npm run check        # Biome lint + format チェック (src/)
npm run test         # Vitest ユニットテスト（ウォッチモード）
npm run coverage     # Vitest カバレッジレポート
npm run e2e          # Playwright e2e テスト
npm run e2e:report   # Playwright HTML レポートを開く
npm run e2e:codegen  # e2e テストをインタラクティブに生成
```

単一のユニットテストファイルを実行：

```bash
npx vitest run tests/unit/path/to/file.test.tsx
```

単一の e2e テストファイルを実行：

```bash
npx playwright test tests/e2e/path/to/file.spec.ts
```

## アーキテクチャ

### ルートグループと認証

`src/proxy.ts` の Next.js ミドルウェアが全ルートを保護し、未認証リクエストを `/auth` にリダイレクトする。ルートグループは2つ：

- `src/app/(login)/` — 認証必須。コンテンツページやブログ全般
- `src/app/(logout)/` — 公開。`/auth` ログインページのみ

認証は NextAuth v4 の Credentials プロバイダー（`src/app/api/auth/[...nextauth]/route.ts`）で処理し、`AUTH_USERNAME` / `AUTH_PASSWORD` 環境変数を照合する。セッションは JWT 戦略（開発: 5分、本番: 24時間）。

### API レイヤー（Hono）

カスタム API ルートは `src/app/api/[[...route]]/route.ts` の単一 Hono アプリにまとめられている。エンドポイント：

- `GET /api/blog` — ブログ一覧
- `GET /api/blog/:id` — ブログ詳細
- `GET /api/skills` — スキル一覧
- `GET /api/draft` — Next.js ドラフトモード有効化、`draft_key` Cookie をセット、`/blog/:id/preview/` にリダイレクト
- `GET /api/draft/disable` — ドラフトモード無効化
- `POST /api/contact` — お問い合わせメール送信（`getServerSession` による認証必須、Resend 経由で送信）

API ルートはミドルウェアの `matcher` 対象外のため認証されない。認証が必要なエンドポイントはハンドラー内で `getServerSession(authOptions)` を呼んでセッションを確認する。

### MicroCMS データ取得

ブログとスキルのデータは `src/libs/microcms/` 経由で MicroCMS から取得する（`blog.ts` と `skill.ts` の2クライアント）。ブログページは `generateStaticParams` による SSG + ISR（`revalidate = 3600`）。1レンダリング内の重複リクエストは React `cache()` で排除している。

### ブログコンテンツのレンダリング

MicroCMS から取得したブログ記事の HTML は `html-react-parser` でレンダリングする。`ArticleDetail` は `<pre>` ブロックを `highlight.js`（自動検出モード）でシンタックスハイライトした出力に置き換える。コードのファイル名は親要素の `data-filename` 属性から読み取る。

目次（ToC）は `src/libs/blog/extractToc.ts` で生の HTML から正規表現により `id` 属性を持つ `<h2>`〜`<h3>` タグを抽出して生成する。

### テーマシステム

ダーク/ライトテーマは Cookie（`theme=light|dark`）に保存する。FOUC を防ぐため、`src/app/layout.tsx` のインラインスクリプトが React ハイドレーション前に Cookie を読み取り `<html>` の `data-theme` をセットする。ハイドレーション後は `ThemeProvider`（`src/features/theme/`）が Jotai の `themeAtom` と Cookie・DOM を同期する。

### フィーチャー構成

`src/features/` はドメインごとに分割されている。各フィーチャーは `components/`・`styles/` を持ち、必要に応じて `hooks/`・`stores/`・`types/` と `index.ts` バレルエクスポートを含む。

| フィーチャー | 概要                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| `blog/`      | 記事一覧・詳細・カテゴリ・タグ・検索・アーカイブ・ToC・シンタックスハイライト             |
| `contact/`   | お問い合わせフォーム（react-hook-form）。`POST /api/contact` へ送信し Resend でメール配信 |
| `hero/`      | トップページのヒーローセクション（スキルアイコンをランダム表示）                          |
| `skills/`    | スキルセット一覧                                                                          |
| `header/`    | グローバルヘッダー                                                                        |
| `footer/`    | グローバルフッター（ナビゲーション・PageTop）                                             |
| `theme/`     | ダーク/ライトテーマ切替（Jotai + Cookie）                                                 |
| `skeleton/`  | ローディングスケルトン                                                                    |

### SEO

JSON-LD 構造化データは `src/libs/seo/jsonLd.ts` で生成（WebSite・BreadcrumbList・BlogPosting）し、`<JsonLd>` コンポーネント経由で注入する。各ページのメタデータは `src/app/layout.tsx` のルート `metadata` エクスポートをスプレッドして構成する。

`src/app/sitemap.ts` — MicroCMS の記事・カテゴリ・タグを取得して `/sitemap.xml` を動的生成（`revalidate = 3600`）。
`src/app/robots.ts` — 全クローラーは `/api/`・`/auth/`・`/blog/*/preview/` を拒否。主要 AI クローラー（GPTBot・Google-Extended・ClaudeBot 等 6種）はサイト全体を拒否。

### Lint・フォーマット

Biome（`biome.json`）で lint とフォーマットを一元管理する。ESLint は使用していない。husky + lint-staged により `git commit` 時に `src/` 以下のステージ済みファイルへ自動実行される。`.ts/.tsx` はフォーマット後に lint チェック、`.css` は同様。lint エラーはコミットをブロックし、自動修正は行わない。フォーマットのみ自動修正される。

### テスト構成

- **ユニットテスト**: Vitest + jsdom。`tests/unit/` 以下に配置。セットアップファイルは `tests/unit/setup.ts`。
- **e2e テスト**: Playwright。`tests/e2e/` 以下に配置。`.env.local` から `AUTH_USERNAME` / `AUTH_PASSWORD` を読み込む。
  - `auth.setup.ts` でログインし、ストレージ状態を `playwright/.auth/storageState.json` に保存する。
  - ほとんどのテストプロジェクトは `setup` に依存し、そのストレージ状態を使用する。
  - `guest` プロジェクトのみ認証状態なしで `auth/page.spec.ts` を実行する。
