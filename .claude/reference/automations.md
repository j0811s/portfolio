# Claude Code 自動化

## Hooks（`.claude/settings.json`）

| 種別 | トリガー | 動作 |
|------|----------|------|
| PreToolUse | Edit / Write で `.env` を含むパスを検出 | 書き込みをブロック |
| PostToolUse | Edit / Write で `src/` 配下のファイルを編集後 | 編集ファイルのみ `npx biome check` を自動実行（末尾20行を表示） |

## サブエージェント（`.claude/agents/`）

| エージェント | 用途 |
|-------------|------|
| `doc-curator` | JSDoc・セッションサマリーの生成（`/wrap-up` から利用） |
| `security-reviewer` | NextAuth・Hono API・フォームの認証/認可/XSS をレビュー |
| `code-reviewer` | 型安全性・React/Next.js 規約・CSS Modules・パフォーマンス・アクセシビリティをレビュー |

## pr-review-toolkit エージェント（プラグイン）

変更内容に応じて以下を使い分ける。`code-reviewer` と `security-reviewer` はプロジェクト固有のため上記を優先する。
これらのレビューエージェントは `/pre-push` のステップ5（コードレビュー）から変更内容に応じて自動起動される。

| エージェント | 使うタイミング |
|-------------|--------------|
| `pr-review-toolkit:silent-failure-hunter` | catch ブロック・エラーハンドリング変更後 |
| `pr-review-toolkit:type-design-analyzer` | 型定義の追加・変更後 |
| `pr-review-toolkit:pr-test-analyzer` | テスト追加・変更後、またはテストカバレッジ確認時 |
| `pr-review-toolkit:comment-analyzer` | JSDoc やコードコメントを追加・変更後 |
| `pr-review-toolkit:code-simplifier` | コードレビュー通過後のポリッシュ |

一括実行: `/pr-review-toolkit:review-pr`（PR 作成前の総合レビューに使用）

## MCP サーバー

| サーバー | 用途 |
|---------|------|
| `context7` | Next.js・Hono・MicroCMS SDK 等の最新ドキュメントを会話中に参照（`use context7` と指示） |
