---
name: pre-push
description: git push前にCLAUDE.mdのワークフロー（check → build → test → e2e）を一括実行し、品質ゲートをパスしたことを確認してから push を促す。
---

# Pre-Push Quality Gate

## 概要

`src/` 配下のファイル編集後、git push前に品質チェックを一括実行する。
CLAUDE.md に定義されたワークフローをそのままスキル化したもの。

## 実行手順

### 1. ステージング状態の確認

```bash
git status
git add -A
git status
```

変更ファイルを確認し、意図しないファイルが含まれていないかチェックする。

### 2. Biome チェック

```bash
npm run check
```

エラーがあれば `npm run lint:fix` と `npm run format` を提案する。
修正不可能なエラーがある場合はここで停止してユーザーに報告する。

### 3. プロダクションビルド

```bash
npm run build
```

ビルドエラーがあれば修正を提案する。

### 4. テストの実行（変更内容に応じて）

`tests/unit/` 配下のファイルが関係する場合：

```bash
npm run test -- --run
```

`tests/e2e/` 配下のファイルが関係する場合：

```bash
npm run e2e
```

### 5. 結果サマリーの報告

全ステップの結果を表にまとめて報告する：

| ステップ | 結果 |
|---------|------|
| Biome check | ✅ / ❌ |
| Build | ✅ / ❌ |
| Unit test | ✅ / ❌ / スキップ |
| E2E test | ✅ / ❌ / スキップ |

全て ✅ であれば `/difit-review` を起動してコードレビューを依頼する。

## 注意事項

- `git commit` と `git push` はこのスキルでは実行しない。ユーザーが判断する。
- ビルドキャッシュが原因の誤検知を避けるため、`npm run build` の前に `.next/` の削除は行わない（必要ならユーザーが指示する）。
