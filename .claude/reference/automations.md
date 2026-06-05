# Claude Code 自動化

## Hooks（`.claude/settings.json`）

| 種別 | トリガー | 動作 |
|------|----------|------|
| PreToolUse | Edit / Write で `.env` を含むパスを検出 | 書き込みをブロック |
| PostToolUse | Edit / Write で `src/` 配下のファイルを編集後 | `npm run check` を自動実行（末尾20行を表示） |

## サブエージェント（`.claude/agents/`）

| エージェント | 用途 |
|-------------|------|
| `doc-curator` | JSDoc・セッションサマリーの生成（`/wrap-up` から利用） |
| `security-reviewer` | NextAuth・Hono API・フォームの認証/認可/XSS をレビュー |
| `code-reviewer` | 型安全性・React/Next.js 規約・CSS Modules・パフォーマンス・アクセシビリティをレビュー |

## MCP サーバー

| サーバー | 用途 |
|---------|------|
| `context7` | Next.js・Hono・MicroCMS SDK 等の最新ドキュメントを会話中に参照（`use context7` と指示） |
