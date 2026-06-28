# ファイル編集後のワークフロー

## `src/`配下にあるファイル編集後

以下の順で必ず実行すること：

1. `/pre-push` スキルが利用可能な場合は優先して実行する（ステップ1〜4を自動化）。利用できない場合は以下を手動で実行：
   1. `git status`,`git add -A`を実行（`git commit`は実行しない）
   2. `npm run check`を実行し、エラーが出たら修正を提案する（不要なら省略可）
   3. `npm run build`を実行し、エラーが出たら修正を提案する（不要なら省略可）
   4. 必要なら`test/`にユニットテストとE2Eテストを作成し、`npm run test`と`npm run e2e`を実行する
2. コードレビューを実施（必須）：
   - **常時**: `code-reviewer` エージェント（型安全性・Next.js・CSS Modules）
   - **変更内容に応じて追加**：
     | 変更内容 | 使うエージェント |
     |---------|----------------|
     | エラーハンドリング・catch ブロック | `pr-review-toolkit:silent-failure-hunter` |
     | 型定義の追加・変更 | `pr-review-toolkit:type-design-analyzer` |
     | テストの追加・変更 | `pr-review-toolkit:pr-test-analyzer` |
     | JSDoc・コメントの追加 | `pr-review-toolkit:comment-analyzer` |
     | 認証・API・フォーム変更 | `security-reviewer` |
3. 追加・変更した機能に合わせて `CLAUDE.md` と `README.md` を更新（不要なら省略可）
4. `/difit-review` でコードレビューを実施（必須）

## `test/`配下にあるファイル編集後

以下の順で必ず実行すること：

1. `git status`,`git add -A`を実行（`git commit`は実行しない）
2. `npm run test`と`npm run e2e`を実行する
3. 追加・変更した機能に合わせて `CLAUDE.md` と `README.md` を更新（不要なら省略可）

## PR 作成前の総合レビュー

push 前に包括的なレビューを行う場合は `/pr-review-toolkit:review-pr` を実行する。
変更内容に応じてレビュー対象を絞ることもできる（例: `/pr-review-toolkit:review-pr errors tests`）。
