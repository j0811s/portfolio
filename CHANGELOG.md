# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `/wrap-up` スラッシュコマンド: セッション終了時にconventional commit・CHANGELOG更新・JSDoc再生成・セッションサマリー生成を自動化
- `doc-curator` サブエージェント: ソース読み取り専用・docs/CHANGELOG書き込み専用のドキュメント整備エージェント
- `.husky/pre-push`: CHANGELOG.md が未更新の場合にプッシュ前に警告を表示
- `pre-push` スキル: `src/` 編集後の品質ゲート（Biome check・ビルド・テスト）を一括実行
- `biome-autofix` スキル: Biome の自動修正可能なエラーを一括適用し残存エラーのみ報告

### Changed

- `CLAUDE.md`: `src/` 編集後のワークフローで `/pre-push` スキルを優先使用するよう更新
- `.husky/pre-push`: CHANGELOG.md 未更新時に push を警告からブロック（exit 1）に変更。回避は `--no-verify`
