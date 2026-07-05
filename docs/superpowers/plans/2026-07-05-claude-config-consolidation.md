# Claude Code 構成の整理・効率化 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 品質ゲートを `/pre-push` 1コマンドに集約し、編集中は編集ファイル単位の軽量チェックのみ走る構成にする。

**Architecture:** `.claude/settings.json` の PostToolUse フックを編集ファイル単位の Biome チェックに変更し、workflow.md にあったレビュー手順を `/pre-push` スキルのステップ5として移設する。`code-review` スキルは廃止し、固有の観点を `code-reviewer` / `security-reviewer` エージェントへ移植する。

**Tech Stack:** Claude Code 設定(JSON hooks / SKILL.md / agents markdown)、Biome、sh(POSIX)。アプリケーションコード(`src/`)には一切触れない。

**Spec:** `docs/superpowers/specs/2026-07-05-claude-config-consolidation-design.md`

## Global Constraints

- ドキュメント・スキル・エージェント定義はすべて日本語で書く。既存ファイルの表記(全角括弧「（）」等)に合わせる。
- フックコマンドは必ず `exit 0` で終了し、編集をブロックしない(PreToolUse の `.env` ブロックのみ `exit 2` を維持)。
- `git push` は実行しない。`git commit` は各タスク末尾で実行する。
- コミットメッセージは `chore(claude): <日本語サブジェクト>` 形式。末尾に以下のフッターを付ける:

  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01NHzPt8XPQuquRgirXZr9z9
  ```

- **設計からの調整(承認済み設計への1点の変更)**: `/react-doctor` の実行は code-reviewer エージェントではなく `/pre-push` のステップ5に置く。エージェントの `allowed-tools`(`Read, Bash(git diff:*), Bash(git log:*), Bash(grep:*), Bash(find:*)`)に Skill ツールが無く、エージェント内からスキルを起動できないため。Task 3 でスペックにもこの調整を反映する。
- 一時ファイルはスクラッチパッド `/private/tmp/claude-501/-Users-sato-github-portfolio/2dfe35b4-6f47-498c-8b37-62315e88d26b/scratchpad/` に置く。

---

### Task 1: PostToolUse フックを編集ファイル単位の Biome チェックに変更

**Files:**
- Modify: `.claude/settings.json`
- Test: シェルでフックコマンドに JSON を流し込んで動作確認(自動テストファイルは作らない)

**Interfaces:**
- Consumes: なし
- Produces: PostToolUse フックの新動作「`/Users/sato/github/portfolio/src/` 配下のファイル編集時のみ `npx biome check <編集ファイル>` を実行」。Task 4(workflow.md)と Task 5(automations.md)がこの動作を記述する。

- [x] **Step 1: settings.json を新しい内容で置き換える**

`.claude/settings.json` の全内容を以下にする(PreToolUse は現状維持、PostToolUse のみ変更):

```json
{
  "env": {
    "CLAUDE_CODE_NEW_INIT": "true"
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "input=$(cat); echo \"$input\" | grep -q '\"file_path\".*\\.env' && echo 'BLOCKED: .env ファイルへの書き込みは禁止されています' && exit 2; exit 0"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "input=$(cat); file=$(printf '%s' \"$input\" | sed -n 's/.*\"file_path\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p'); case \"$file\" in /Users/sato/github/portfolio/src/*) cd /Users/sato/github/portfolio && npx biome check \"$file\" 2>&1 | tail -20;; esac; exit 0"
          }
        ]
      }
    ]
  }
}
```

設計判断のメモ:
- パスの判定は `*/src/*` ではなくプロジェクトのフルパス前方一致 `/Users/sato/github/portfolio/src/*` にする(他リポジトリの src/ や `src` を含む別パスへの誤反応を防ぐ)。
- `sed` の `.*"file_path"` は貪欲マッチのため、Write ツールの `content` 内に `"file_path"` という文字列が含まれる場合は誤抽出の可能性がある。その場合もチェックが走らない/余計に走るだけで編集はブロックされない(既存の grep 実装にも同じ制約があった)。

- [x] **Step 2: JSON として妥当か検証する**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('/Users/sato/github/portfolio/.claude/settings.json','utf8')); console.log('OK')"
```
Expected: `OK`

- [x] **Step 3: フックコマンドを抽出してテストスクリプトを作る**

Run:
```bash
node -e "const s=require('/Users/sato/github/portfolio/.claude/settings.json'); process.stdout.write(s.hooks.PostToolUse[0].hooks[0].command)" > "/private/tmp/claude-501/-Users-sato-github-portfolio/2dfe35b4-6f47-498c-8b37-62315e88d26b/scratchpad/hookcmd.sh"
cat "/private/tmp/claude-501/-Users-sato-github-portfolio/2dfe35b4-6f47-498c-8b37-62315e88d26b/scratchpad/hookcmd.sh"
```
Expected: `input=$(cat); file=$(printf ...` で始まる1行のシェルコマンドが表示される(JSON エスケープが解除された状態)。

- [x] **Step 4: src/ 配下のファイルでフックが動くことを確認する(正常系)**

Run:
```bash
echo '{"tool_input":{"file_path":"/Users/sato/github/portfolio/src/app/layout.tsx"}}' | sh "/private/tmp/claude-501/-Users-sato-github-portfolio/2dfe35b4-6f47-498c-8b37-62315e88d26b/scratchpad/hookcmd.sh"; echo "exit=$?"
```
Expected: Biome の出力(`Checked 1 file in ...` など)が表示され、最後に `exit=0`。所要時間は数秒以内。

- [x] **Step 5: src/ 外のファイルではフックが何もしないことを確認する(負例)**

Run:
```bash
echo '{"tool_input":{"file_path":"/Users/sato/github/portfolio/docs/sessions/2026-05-27.md"}}' | sh "/private/tmp/claude-501/-Users-sato-github-portfolio/2dfe35b4-6f47-498c-8b37-62315e88d26b/scratchpad/hookcmd.sh"; echo "exit=$?"
```
Expected: Biome 出力なし、`exit=0` のみ表示される。

- [x] **Step 6: `.env` ブロック(PreToolUse)が現状維持であることを確認する**

Run:
```bash
node -e "const s=require('/Users/sato/github/portfolio/.claude/settings.json'); const c=s.hooks.PreToolUse[0].hooks[0].command; console.log(c.includes('BLOCKED') && c.includes('exit 2') ? 'OK' : 'CHANGED!')"
```
Expected: `OK`

- [x] **Step 7: コミット**

```bash
cd /Users/sato/github/portfolio && git add .claude/settings.json && git commit -m "chore(claude): PostToolUseフックを編集ファイル単位のBiomeチェックに変更

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHzPt8XPQuquRgirXZr9z9"
```

---

### Task 2: `/pre-push` スキルにレビューフェーズを統合

**Files:**
- Modify: `.claude/skills/pre-push/SKILL.md`(全面書き換え)

**Interfaces:**
- Consumes: なし
- Produces: `/pre-push` の新ステップ構成「1 ステージング → 2 Biome → 3 ビルド → 4 テスト → 5 コードレビュー → 6 サマリー」。Task 4(workflow.md)と Task 5(automations.md)がこの構成を参照する。

- [x] **Step 1: SKILL.md を新しい内容で置き換える**

`.claude/skills/pre-push/SKILL.md` の全内容を以下にする:

````markdown
---
name: pre-push
description: git push前に品質ゲート（check → build → test → e2e → コードレビュー）を一括実行し、全てパスしたことを確認してから push を促す。
---

# Pre-Push Quality Gate

## 概要

git push / PR 作成の前に、品質チェックとコードレビューを一括実行する。
編集中の自動チェックは PostToolUse フック（編集ファイルのみ）に任せ、
`src/` 全体の品質確認とコードレビューは本スキルに集約されている。

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

エラーがあれば `/biome-autofix` を実行する。
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

### 5. コードレビュー

1. `git diff HEAD` で変更内容を確認する（未コミット変更が無い場合は `git diff main...HEAD`）
2. `.tsx` / `.jsx` の変更がある場合は `/react-doctor` を実行し、優先度「高」「中」の問題が消えるまで修正する（「低」は許容）
3. `code-reviewer` エージェントを起動する（常時）
4. 変更内容に応じて追加エージェントを起動する：

   | 変更内容 | エージェント |
   |---------|-------------|
   | catch ブロック・エラーハンドリング | `pr-review-toolkit:silent-failure-hunter` |
   | 型定義の追加・変更 | `pr-review-toolkit:type-design-analyzer` |
   | テストの追加・変更 | `pr-review-toolkit:pr-test-analyzer` |
   | JSDoc・コメントの追加 | `pr-review-toolkit:comment-analyzer` |
   | 認証・API・フォーム変更 | `security-reviewer` |

5. 最後に `/difit-review` を起動してユーザーによるレビューを依頼する

### 6. 結果サマリーの報告

全ステップの結果を表にまとめて報告する：

| ステップ | 結果 |
|---------|------|
| Biome check | ✅ / ❌ |
| Build | ✅ / ❌ |
| Unit test | ✅ / ❌ / スキップ |
| E2E test | ✅ / ❌ / スキップ |
| レビュー | Must 指摘 n 件 / 問題なし |

Must（要修正）の指摘が残っている場合は push を促さず、修正を提案する。

## 注意事項

- `git commit` と `git push` はこのスキルでは実行しない。ユーザーが判断する。
- ビルドキャッシュが原因の誤検知を避けるため、`npm run build` の前に `.next/` の削除は行わない（必要ならユーザーが指示する）。
- PR 作成前にさらに包括的なレビューを行いたい場合は `/pr-review-toolkit:review-pr` を使う（対象を絞る例: `/pr-review-toolkit:review-pr errors tests`）。
````

- [x] **Step 2: 内容を検証する**

Run:
```bash
grep -c "difit-review" /Users/sato/github/portfolio/.claude/skills/pre-push/SKILL.md
grep -n "silent-failure-hunter\|type-design-analyzer\|pr-test-analyzer\|comment-analyzer\|security-reviewer" /Users/sato/github/portfolio/.claude/skills/pre-push/SKILL.md | wc -l
```
Expected: 1行目のコマンドは `1`(ステップ5内の1回のみ。旧「全て ✅ であれば /difit-review を起動」の行が残っていないこと)。2行目のコマンドは `5`(条件表に5エージェントが揃っている)。

- [x] **Step 3: コミット**

```bash
cd /Users/sato/github/portfolio && git add .claude/skills/pre-push/SKILL.md && git commit -m "chore(claude): pre-pushスキルにレビューフェーズを統合

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHzPt8XPQuquRgirXZr9z9"
```

---

### Task 3: レビュー観点をエージェントへ移植し code-review スキルを削除

**Files:**
- Modify: `.claude/agents/code-reviewer.md`
- Modify: `.claude/agents/security-reviewer.md`
- Modify: `docs/superpowers/specs/2026-07-05-claude-config-consolidation-design.md`(react-doctor の移設先の記述を調整)
- Delete: `.claude/skills/code-review/`(ディレクトリごと)

**Interfaces:**
- Consumes: なし
- Produces: `code-review` スキルが存在しない状態。Task 5 の整合性チェックが「参照ゼロ」を前提にする。

- [x] **Step 1: code-reviewer.md に観点を2つ追加する**

`.claude/agents/code-reviewer.md` の **React / Next.js** セクション末尾(`generateStaticParams の抜け漏れ` の行の直後)に以下を追加:

```markdown
- 内部遷移で `Link` コンポーネントを使わず `<a>` タグを直接使っていないか
```

同ファイルの **パフォーマンス** セクション末尾(`バンドルサイズに影響する大きな依存の追加` の行の直後)に以下を追加:

```markdown
- Google Fonts に `<link rel="preconnect">` が設定されているか
```

- [x] **Step 2: security-reviewer.md に観点を1つ追加する**

`.claude/agents/security-reviewer.md` の **シークレット管理** セクション末尾(`console.log によるシークレット漏洩` の行の直後)に以下を追加:

```markdown
- `NEXT_PUBLIC_` プレフィックスの誤用によるシークレットのクライアントバンドル露出
```

- [x] **Step 3: スペックの react-doctor 記述を実装に合わせて修正する**

`docs/superpowers/specs/2026-07-05-claude-config-consolidation-design.md` のセクション4にある以下の箇条書き:

```markdown
  - `/react-doctor` を実行し、優先度「高」「中」の問題が消えるまで修正する(「低」は許容)
```

を次に置き換える:

```markdown
  - `/react-doctor` の実行ステップは `/pre-push` のステップ5に移設する(code-reviewer エージェントの allowed-tools に Skill ツールが無く、エージェント内からスキルを起動できないため)
```

- [x] **Step 4: code-review スキルを削除する**

Run:
```bash
git -C /Users/sato/github/portfolio rm -r .claude/skills/code-review
```
Expected: `rm '.claude/skills/code-review/SKILL.md'`

- [x] **Step 5: 観点の移植漏れがないことを確認する**

削除した `code-review` スキルにあった観点のうち、以下がどこかに存在することを grep で確認する:

Run:
```bash
cd /Users/sato/github/portfolio
grep -rn "react-doctor" .claude/skills/pre-push/SKILL.md
grep -n "preconnect" .claude/agents/code-reviewer.md
grep -n "NEXT_PUBLIC_" .claude/agents/security-reviewer.md
grep -n "Link" .claude/agents/code-reviewer.md
```
Expected: 4コマンドすべてで1行以上ヒットする。

(補足: 旧スキルのその他の観点は既存定義でカバー済み — CSS ネスト禁止・use client 境界・`cache()`・a11y は code-reviewer に、`getServerSession`・サーバーサイドバリデーション・環境変数漏れは security-reviewer に、`next/image` は Biome の `noImgElement` に存在する。)

- [x] **Step 6: コミット**

```bash
cd /Users/sato/github/portfolio && git add .claude/agents/code-reviewer.md .claude/agents/security-reviewer.md docs/superpowers/specs/2026-07-05-claude-config-consolidation-design.md && git commit -m "chore(claude): code-reviewスキルを廃止しエージェントへ観点を移植

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHzPt8XPQuquRgirXZr9z9"
```

(`git rm` 済みの削除は自動的にステージングされている。)

---

### Task 4: workflow.md を pre-push 集約構成に簡素化

**Files:**
- Modify: `.claude/reference/workflow.md`(全面書き換え)

**Interfaces:**
- Consumes: Task 1 のフック動作、Task 2 の `/pre-push` ステップ構成(記述がこれらと一致している必要がある)
- Produces: 簡素化された workflow.md。CLAUDE.md から `@.claude/reference/workflow.md` で読み込まれる。

- [x] **Step 1: workflow.md を新しい内容で置き換える**

`.claude/reference/workflow.md` の全内容を以下にする:

```markdown
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

## `test/` 配下にあるファイル編集後

1. `git status`,`git add -A`を実行（`git commit`は実行しない）
2. `npm run test`と`npm run e2e`を実行する

## ドキュメント更新

追加・変更した機能に合わせて `CLAUDE.md` と `README.md` を更新する（不要なら省略可）。
```

- [x] **Step 2: 旧手順の残骸がないことを確認する**

Run:
```bash
grep -n "常時\|エージェントを追加\|手動で実行" /Users/sato/github/portfolio/.claude/reference/workflow.md; echo "exit=$?"
```
Expected: ヒットなし、`exit=1`(旧「編集ごとの必須レビュー」記述と手動フォールバック手順が消えている)。

- [x] **Step 3: コミット**

```bash
cd /Users/sato/github/portfolio && git add .claude/reference/workflow.md && git commit -m "chore(claude): workflow.mdをpre-push集約構成に簡素化

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHzPt8XPQuquRgirXZr9z9"
```

---

### Task 5: automations.md の同期と全体整合性チェック

**Files:**
- Modify: `.claude/reference/automations.md`

**Interfaces:**
- Consumes: Task 1〜4 の全変更(記述がすべて実態と一致している必要がある)
- Produces: 完成状態。以後の変更なし。

- [x] **Step 1: automations.md のフック表を更新する**

`.claude/reference/automations.md` の Hooks 表にある以下の行:

```markdown
| PostToolUse | Edit / Write で `src/` 配下のファイルを編集後 | `npm run check` を自動実行（末尾20行を表示） |
```

を次に置き換える:

```markdown
| PostToolUse | Edit / Write で `src/` 配下のファイルを編集後 | 編集ファイルのみ `npx biome check` を自動実行（末尾20行を表示） |
```

- [x] **Step 2: pr-review-toolkit セクションに自動起動の説明を追加する**

同ファイルの「## pr-review-toolkit エージェント（プラグイン）」セクションの導入文:

```markdown
変更内容に応じて以下を使い分ける。`code-reviewer` と `security-reviewer` はプロジェクト固有のため上記を優先する。
```

を次に置き換える:

```markdown
変更内容に応じて以下を使い分ける。`code-reviewer` と `security-reviewer` はプロジェクト固有のため上記を優先する。
これらのレビューエージェントは `/pre-push` のステップ5（コードレビュー）から変更内容に応じて自動起動される。
```

- [x] **Step 3: 全体の整合性を grep で確認する**

Run:
```bash
cd /Users/sato/github/portfolio
grep -rn "skills/code-review\|code-review スキル\|/code-review" .claude CLAUDE.md README.md 2>/dev/null | grep -v "code-reviewer" ; echo "exit=$?"
```
Expected: ヒットなし、`exit=1`(廃止した `code-review` スキルへの参照が `.claude`・CLAUDE.md・README.md に残っていない。`code-reviewer` エージェントへの言及は除外済み)。

Run:
```bash
grep -rn "npm run check" /Users/sato/github/portfolio/.claude/reference/automations.md; echo "exit=$?"
```
Expected: ヒットなし、`exit=1`(フック表の旧記述が残っていない。コマンド一覧 `commands.md` の `npm run check` は対象外なので触らない)。

- [x] **Step 4: 通読による最終確認**

`workflow.md`・`automations.md`・`.claude/skills/pre-push/SKILL.md`・`.claude/settings.json` を Read で通読し、以下を確認する:

1. workflow.md のステップ番号・内容が pre-push SKILL.md の実手順と一致している
2. automations.md のフック説明が settings.json の実装と一致している
3. 廃止済みスキルや旧手順への言及が残っていない

矛盾があればこのタスク内で修正する。

- [x] **Step 5: コミット**

```bash
cd /Users/sato/github/portfolio && git add .claude/reference/automations.md && git commit -m "chore(claude): automations.mdを新構成に同期

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHzPt8XPQuquRgirXZr9z9"
```

---

## 完了後の手動検証（ユーザー向けメモ）

計画の全タスク完了後、次に `src/` を実際に変更する機会に以下を確認する:

1. ファイル編集直後にフックが編集ファイルのみをチェックし、数秒以内に完了すること
2. `/pre-push` を実行すると check → build → test → レビュー(react-doctor → code-reviewer → 条件付きエージェント → difit-review)→ サマリー表が一括で走ること

(この2点はビルド・e2e・エージェント起動を伴うため、本計画の実行中には行わない。)
