# CLAUDE.md

このファイルはリポジトリ内で作業する Claude Code (claude.ai/code) へのガイダンスを提供します。

## コマンド

```bash
npm run dev          # 開発サーバー起動 (ポート3000)
npm run build        # 本番ビルド
npm run lint         # ESLint チェック
npm run lint:fix     # ESLint 自動修正
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

### MicroCMS データ取得

ブログとスキルのデータは `src/libs/microcms/` 経由で MicroCMS から取得する（`blog.ts` と `skill.ts` の2クライアント）。ブログページは `generateStaticParams` による SSG + ISR（`revalidate = 3600`）。1レンダリング内の重複リクエストは React `cache()` で排除している。

### ブログコンテンツのレンダリング

MicroCMS から取得したブログ記事の HTML は `html-react-parser` でレンダリングする。`ArticleDetail` は `<pre>` ブロックを `highlight.js`（自動検出モード）でシンタックスハイライトした出力に置き換える。コードのファイル名は親要素の `data-filename` 属性から読み取る。

目次（ToC）は `src/libs/blog/extractToc.ts` で生の HTML から正規表現により `id` 属性を持つ `<h2>`〜`<h3>` タグを抽出して生成する。

### テーマシステム

ダーク/ライトテーマは Cookie（`theme=light|dark`）に保存する。FOUC を防ぐため、`src/app/layout.tsx` のインラインスクリプトが React ハイドレーション前に Cookie を読み取り `<html>` の `data-theme` をセットする。ハイドレーション後は `ThemeProvider`（`src/features/theme/`）が Jotai の `themeAtom` と Cookie・DOM を同期する。

### フィーチャー構成

`src/features/` はドメインごとに分割されている。各フィーチャーは `components/`・`styles/` を持ち、必要に応じて `hooks/`・`stores/`・`types/` と `index.ts` バレルエクスポートを含む。

### SEO

JSON-LD 構造化データは `src/libs/seo/jsonLd.ts` で生成（WebSite・BreadcrumbList・BlogPosting）し、`<JsonLd>` コンポーネント経由で注入する。各ページのメタデータは `src/app/layout.tsx` のルート `metadata` エクスポートをスプレッドして構成する。

### テスト構成

- **ユニットテスト**: Vitest + jsdom。`tests/unit/` 以下に配置。セットアップファイルは `tests/unit/setup.ts`。
- **e2e テスト**: Playwright。`tests/e2e/` 以下に配置。`.env.local` から `AUTH_USERNAME` / `AUTH_PASSWORD` を読み込む。
  - `auth.setup.ts` でログインし、ストレージ状態を `playwright/.auth/storageState.json` に保存する。
  - ほとんどのテストプロジェクトは `setup` に依存し、そのストレージ状態を使用する。
  - `guest` プロジェクトのみ認証状態なしで `auth/page.spec.ts` を実行する。
