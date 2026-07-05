# ファイル編集後のワークフロー

## `src/` 配下の編集中

- PostToolUse フックが編集ファイルのみを `npx biome check` で自動チェックする
- エラーが解消しない場合は `/biome-autofix` を実行する
- 編集ごとのコードレビューは行わない（push 前に集約）

## push / PR 作成前（必須）

`/pre-push` スキルを実行する。以下が一括で実行される：

1. `git add` とステージング確認
2. `npm run check`（`src/` 全体）
3. `npm run build`
4. `npm run test` / `npm run e2e`（変更内容に応じて）
5. コードレビュー（react-doctor → code-reviewer → 変更内容に応じた追加エージェント → `/difit-review`）

さらに包括的なレビューが必要な場合は `/pr-review-toolkit:review-pr` を実行する
（レビュー対象を絞る例: `/pr-review-toolkit:review-pr errors tests`）。

## `tests/` 配下にあるファイル編集後

1. `git status`,`git add -A`を実行（`git commit`は実行しない）
2. `npm run test`と`npm run e2e`を実行する

## ドキュメント更新

追加・変更した機能に合わせて `CLAUDE.md` と `README.md` を更新する（不要なら省略可）。
