---
name: code-review
description: 実装後のコードレビューを実施するときの観点を定義する。可読性/パフォーマンス/セキュリティ/プロジェクト規約を確認する。
---

# 1. 静的解析（自動修正）

```bash
npm run lint:fix   # Biome lint 自動修正
npm run format     # Biome フォーマット自動修正
npm run check      # 残存エラーを確認
```

エラーが残った場合は内容を確認して修正を提案する。

# 2. JSX / TSX 診断

- `/react-doctor` を実行する
- 優先度「高」「中」の問題が消えるまで再帰的に修正する
- 優先度「低」の問題は、残っても許容とする

# 3. プロジェクト規約チェック

## CSS Modules

- ネスト構文は使わない。フラットなセレクターで記述する（例: `.parent .child {}` ではなく `.parentChild {}`）

## フィーチャー構成（`src/features/`）

- 各フィーチャーは `components/`・`styles/` を持ち、必要に応じて `hooks/`・`stores/`・`types/`・`index.ts` を含む
- 外部から参照するものは `index.ts` のバレルエクスポート経由にする

## サーバー/クライアントコンポーネント境界

- `'use client'` が不要なコンポーネントに付いていないか確認する
- データフェッチはサーバーコンポーネントで行い、必要な部分だけクライアントに分離する

## データフェッチ（MicroCMS）

- 1レンダリング内の重複リクエストは React `cache()` で排除されているか確認する

# 4. セキュリティリスク

- `dangerouslySetInnerHTML` が新たに追加された場合、XSS リスクがないか確認する（修正前に提案する）
- 認証が必要な API ルート（例: `POST /api/contact`）は `getServerSession` でセッション確認しているか確認する
- 環境変数（`AUTH_USERNAME`/`AUTH_PASSWORD` 等）がクライアントバンドルに漏れていないか確認する（`NEXT_PUBLIC_` プレフィックスの誤用）
- お問い合わせフォームへの入力はサーバーサイドでもバリデーションしているか確認する

# 5. パフォーマンス

- `<img>` タグを直接使わず `next/image` を使っているか確認する（Biome `noImgElement` でも検出）
- Google Fonts は `<link rel="preconnect">` を設定しているか確認する
- 不要な `use client` によるクライアントバンドルの肥大化がないか確認する
- `Link` コンポーネントを使うべき箇所で `<a>` タグを直接使っていないか確認する

# 6. アクセシビリティ

Biome の a11y ルール（`useAltText`・`useAriaPropsForRole` 等）でエラー/警告が出ていないか `npm run check` で確認する。

# 7. テスト

変更箇所に対応するテストが存在するか確認し、なければ作成を提案する。

```bash
npm run test   # ユニットテスト（tests/unit/）
npm run e2e    # E2E テスト（tests/e2e/）
```
