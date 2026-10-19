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
5. コードレビュー（react-doctor → code-reviewer → 変更内容に応じた追加エージェント）

さらに包括的なレビューが必要な場合は `/pr-review-toolkit:review-pr` を実行する
（レビュー対象を絞る例: `/pr-review-toolkit:review-pr errors tests`）。

## `tests/` 配下にあるファイル編集後

1. `git status`,`git add -A`を実行（`git commit`は実行しない）
2. `npm run test`と`npm run e2e`を実行する

## ドキュメント更新

追加・変更した機能に合わせて `CLAUDE.md` と `README.md` を更新する（不要なら省略可）。

## GitHub Issue 起点の開発

1. `/propose-issues` — コードベース・セッションの残課題・本番（Vercel・Lighthouse）・依存パッケージから根拠付きの Issue 候補を出し、選んだものだけ Issue を作成する（引数 `code` / `sessions` / `prod` / `deps` で情報源を絞れる）
2. `/ship-issue <Issue番号>` — Issue の読み込み → 方針の承認 → 実装 → `/pre-push` → コミット・PR 内容の承認 → PR 作成 → CI 通過までを進め、停止する
3. マージは人間が GitHub 上で行う（Claude は `gh pr merge` を実行しない）
4. マージ後、`.github/workflows/release.yml` がコミットの型から GitHub Release を自動作成する（`!:` / `BREAKING CHANGE` → major、`feat` → minor、`fix` → patch、それ以外のみならリリースなし）。`/ship-issue <Issue番号>` を再度実行すると Release・Issue のクローズ確認とブランチの後片付けを行う

コミットの型がリリースのバージョンを決めるため、型は変更内容に正確に合わせる。スキル本体は share-claude で管理し、`bin/deploy.py` で配布する（「Claude Code 自動化」のスキルの節を参照）。
