# Claude Code 自動化

## Hooks（`.claude/settings.json`）

| 種別 | トリガー | 動作 |
|------|----------|------|
| PreToolUse | Edit / Write で `.env` を含むパスを検出 | 書き込みをブロック |
| PostToolUse | Edit / Write で `src/` 配下のファイルを編集後 | 編集ファイルのみ `npx biome check` を自動実行（末尾20行を表示） |

## スキル（`.claude/skills/`）

`.claude/skills/`・`.claude/hooks/`・`.claude/rules/`・`.claude/settings.json`・`CLAUDE.md` は share-claude リポジトリ（`~/github/share-claude`）が配布元で、portfolio では gitignore している。編集は share-claude 側（共通は `common/`、portfolio 固有は `project/portfolio/`）で行い、`./bin/deploy.py portfolio` で配布する。

| スキル | share-claude 内の配置 | 用途 |
|--------|--------|------|
| `/pre-push` | `project/portfolio/skills/` | push・PR 作成前の品質ゲート（check → build → test → e2e → コードレビュー） |
| `/wrap-up` | `project/portfolio/skills/` | 未コミット変更を論理単位で conventional commit し、JSDoc・セッションサマリーを更新 |
| `/biome-autofix` | `project/portfolio/skills/` | Biome の自動修正可能なエラーを一括適用し、残りを報告 |
| `/ship-issue <番号>` | `project/portfolio/skills/` | Issue から PR 作成・CI 通過まで進め、マージ後に Release を確認（「ファイル編集後のワークフロー」参照） |
| `/propose-issues` | `project/portfolio/skills/` | 根拠付きの Issue 候補を提示し、選んだものを作成 |
| `/review-skill <スキル名>` | `common/skills/` | スキル（SKILL.md）を Claude Code 公式ドキュメントに照らしてレビューし、修正候補を提示 |
| `playwright-cli` | `common/skills/` | ブラウザ操作・Playwright テストの作成 |

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

## CI（GitHub Actions）

`.github/workflows/check.yml` が PR と `main` への push（`src/`・`tests/`・依存や設定ファイルの変更時のみ）で `npm run check`・`npm run test` を実行する。

`main` はリポジトリルールセットで保護されている：PR 経由の変更のみ（直接 push・force push・削除は禁止）、CI の `check` ジョブ通過が必須、approve は不要。マージは人間が GitHub 上で行う（`/ship-issue` は PR 作成・CI 通過までで停止する）。

`.github/workflows/release.yml` が `main` への push（PR マージ）で `scripts/next-version.sh` を実行し、前回の `v*` タグ以降のコミットの型から次のバージョンを決めて GitHub Release（タグ・自動生成リリースノート）を作成する。`!:` / `BREAKING CHANGE` → major、`feat` → minor、`fix` → patch、それ以外のみならリリースしない。`package.json` の `version` は更新しない（バージョンはタグで管理）。

## MCP サーバー

| サーバー | 用途 |
|---------|------|
| `context7` | Next.js・Hono・MicroCMS SDK 等の最新ドキュメントを会話中に参照（`use context7` と指示） |
