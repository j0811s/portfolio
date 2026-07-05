# Claude Code 構成の整理・効率化 設計書

日付: 2026-07-05
ステータス: 承認済み

## 背景と目的

`.claude/` 配下のスキル・エージェント・フック・参照ドキュメントが成長した結果、次の問題が生じている。

1. **レビューの多層化**: `src/` を編集するたびに code-reviewer エージェント + 条件付き pr-review-toolkit エージェント + `/difit-review` の実行が workflow.md で義務付けられており、作業テンポを大きく下げている。
2. **フックの過剰実行**: PostToolUse フックが1ファイル編集ごとに `src/` 全体の `npm run check` を実行しており、ファイル数の増加に比例して待ち時間が延びる。コミット時には husky + lint-staged が同等のチェックを行っており冗長。
3. **定義の重複**: workflow.md と `/pre-push` スキルが同じ手順を二重に記述している。`code-review` スキルと `code-reviewer` エージェントはチェック観点の大半が重複し、セキュリティ観点は `security-reviewer` とも三重になっている。

本設計は「編集中は軽量チェックのみ、push/PR 前に `/pre-push` 1コマンドで品質ゲートを完走する」構成に集約し、定義の単一ソース化を行う。

## 変更内容

### 1. フック変更(`.claude/settings.json`)

- **PostToolUse**: 入力 JSON から `file_path` を抽出し、`src/` 配下の場合のみ `npx biome check <編集ファイル>` を実行する(出力は末尾20行)。`file_path` の抽出は `"file_path": "..."` のコロン後の空白有無どちらにもマッチするパターンを使う。プロジェクトルート(`/Users/sato/github/portfolio`)へ `cd` してから実行する。フックは常に `exit 0` で終了し、編集をブロックしない。
- **PreToolUse**(`.env` への書き込みブロック): 現状維持。

### 2. `/pre-push` スキル拡張(`.claude/skills/pre-push/SKILL.md`)

既存ステップ 1〜4(git add → `npm run check` → `npm run build` → test/e2e)の後に **ステップ5: レビューフェーズ** を追加する。

1. `git diff HEAD`(未コミットが無い場合は main との差分)から変更の種類を判定する
2. `.tsx` / `.jsx` の変更がある場合は `/react-doctor` を実行する
3. `code-reviewer` エージェントを常時起動する
4. 変更内容に応じて追加エージェントを起動する(条件表は workflow.md から本スキルへ移設):

   | 変更内容 | エージェント |
   |---------|-------------|
   | catch ブロック・エラーハンドリング | `pr-review-toolkit:silent-failure-hunter` |
   | 型定義の追加・変更 | `pr-review-toolkit:type-design-analyzer` |
   | テストの追加・変更 | `pr-review-toolkit:pr-test-analyzer` |
   | JSDoc・コメントの追加 | `pr-review-toolkit:comment-analyzer` |
   | 認証・API・フォーム変更 | `security-reviewer` |

5. 最後に `/difit-review` を起動する
6. 結果サマリー表に「レビュー」行を追加し、Must(要修正)指摘の件数を表示する

`git commit` / `git push` を実行しない方針は変更しない。

### 3. `workflow.md` の簡素化(`.claude/reference/workflow.md`)

現在の多段手順を以下に置き換える。

- **`src/` 編集中**: PostToolUse フックが編集ファイルを自動チェックする。エラーが解消しない場合は `/biome-autofix` を使う。編集ごとの必須レビューは行わない。
- **push/PR 前**: `/pre-push` を実行する(チェック → ビルド → テスト → レビューまで一括)。
- **`test/` 編集後**: `npm run test` / `npm run e2e` を実行する(現状維持)。
- **ドキュメント更新**: 追加・変更した機能に合わせて CLAUDE.md と README.md を更新する(不要なら省略可。現状維持)。

### 4. `code-review` スキルの廃止

- `.claude/skills/code-review/` を削除する。
- スキルにのみ存在した観点を `code-reviewer` エージェント(`.claude/agents/code-reviewer.md`)へ移植する:
  - `/react-doctor` の実行ステップは `/pre-push` のステップ5に移設する(code-reviewer エージェントの allowed-tools に Skill ツールが無く、エージェント内からスキルを起動できないため)
  - Google Fonts に `<link rel="preconnect">` が設定されているか
  - `Link` コンポーネントを使うべき箇所で `<a>` タグを直接使っていないか
- `NEXT_PUBLIC_` プレフィックスの誤用によるシークレットのクライアントバンドル漏れチェックを `security-reviewer`(`.claude/agents/security-reviewer.md`)のシークレット管理欄に追加する。

### 5. ドキュメント同期(`.claude/reference/automations.md`)

- フック表の PostToolUse 説明を「編集ファイルのみ `npx biome check`」に更新する。
- pr-review-toolkit エージェントの使い分け表に「`/pre-push` のレビューフェーズから自動起動される」ことを明記する。
- `code-review` スキルへの言及があれば削除する。

## 変更しないもの

- PreToolUse の `.env` ブロックフック
- `biome-autofix` / `wrap-up` / `playwright-cli` スキル
- husky + lint-staged のコミット時チェック
- エージェント3つの役割分担(code-reviewer / security-reviewer / doc-curator)
- `src/` 配下のアプリケーションコード

## テスト・検証方法

1. `src/` 配下のファイルを1つ編集し、フックが編集ファイルのみをチェックすること・数秒以内に完了することを確認する。
2. `.env` への書き込みが引き続きブロックされることを確認する。
3. `/pre-push` を実行し、ステップ1〜5が順に走り、サマリー表にレビュー行が表示されることを確認する。
4. workflow.md・automations.md・スキル・エージェント間で手順の記述が矛盾していないことを通読で確認する。

## 成功基準

- `src/` 編集ごとの自動チェックが編集ファイル単位になり、体感待ち時間が減る。
- レビューは `/pre-push` 実行時にのみ走り、編集中のエージェント起動が無くなる。
- レビュー観点・ワークフロー手順の定義がそれぞれ1ファイルに集約され、二重管理が無くなる。
