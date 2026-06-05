# コマンド

```bash
npm run dev          # 開発サーバー起動 (ポート3000)
npm run build        # 本番ビルド
npm run lint         # Biome lint チェック (src/)
npm run lint:fix     # Biome lint 自動修正 (src/)
npm run format       # Biome フォーマット自動修正 (src/)
npm run check        # Biome lint + format チェック (src/)
npm run test         # Vitest ユニットテスト（ウォッチモード）
npm run coverage     # Vitest カバレッジレポート
npm run e2e          # Playwright e2e テスト
npm run e2e:report   # Playwright HTML レポートを開く
npm run e2e:codegen  # e2e テストをインタラクティブに生成
```

単一のユニットテストファイルを実行：

```bash
npx vitest run tests/unit/path/to/file.test.tsx
```

単一の e2e テストファイルを実行：

```bash
npx playwright test tests/e2e/path/to/file.spec.ts
```
