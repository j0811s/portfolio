# PWA化（インストール可能化）設計書

日付: 2026-08-08
ステータス: 承認済み

## 背景と目的

本サイトは `/auth` 以外の全ページがログイン必須の非公開ポートフォリオ・開発ブログであり、`robots: { index: false, follow: false }` で検索エンジンにも公開していない、実質的に個人利用向けのサイトである。この性質は、ブラウザのタブで開く従来の利用形態よりも、ホーム画面に追加してスタンドアロンアプリのように起動できる PWA（Progressive Web App）化と相性が良い。

本設計は Web App Manifest を追加してインストール可能にすることのみを目的とし、Service Worker によるオフライン対応は含めない。ログイン必須ページのキャッシュはセキュリティ上の設計検討（ログアウト後のキャッシュ扱いなど）が別途必要になるため、スコープ外とする。

## 変更内容

### 1. マニフェストファイル (`src/app/manifest.ts`)

既存の `src/app/sitemap.ts` / `src/app/robots.ts` と同じ Next.js ファイル規約を使う。`src/app/manifest.ts` を配置するだけで Next.js が `/manifest.webmanifest` を自動生成し、`<link rel="manifest">` を `<head>` へ自動挿入する。`layout.tsx` 側のコード変更は不要。

`MetadataRoute.Manifest` を返す関数として実装し、`SITE_META`（`src/constants/site.ts`）から `name` / `description` を取得する。

内容:

| フィールド | 値 |
|---|---|
| `name` | `SITE_META.title`（「ポートフォリオサイト」） |
| `short_name` | 同上 |
| `description` | `SITE_META.description` |
| `start_url` | `/` |
| `display` | `standalone` |
| `background_color` | `#e8eaf0`（ライトテーマの `--bg-primary`） |
| `theme_color` | `#ff7e0f`（ライトテーマの `--theme-primary`） |
| `lang` | `ja` |
| `icons` | 192×192・512×512（`purpose: "any maskable"`） |

### 2. アイコン画像

- `public/logo.png`（512×512、既存）をそのまま 512 用アイコンとして使う。中央の「J」ロゴの周囲に十分な余白があり、maskable purpose（Android のアダプティブアイコンによる円形/角丸クロップ）にも耐える構図であることを確認済み。
- `public/icon-192.png` を `logo.png` から縮小生成して新規追加する。
- iOS 用の `src/app/apple-touch-icon.png` は既存のものをそのまま流用し、変更しない。

### 3. `viewport.themeColor` の追加（`src/app/layout.tsx`）

マニフェストの `theme_color` は静的な1色しか持てず、OS のダークモード設定に連動しない。`layout.tsx` の `viewport` export に `themeColor` を light/dark 両対応で追加し、ブラウザのアドレスバー/ステータスバー色を OS のカラースキームに追従させる。

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ff7e0f' },
    { media: '(prefers-color-scheme: dark)', color: '#3a7fa8' },
  ],
};
```

これはサイト内の Cookie ベースのテーマ切替（`data-theme` 属性、`ThemeProvider`）とは独立した軸であり、OS 設定のみに連動する。両者が食い違うケース（OS はダーク、サイト内切替でライトを選択、など）は許容する。

## テスト・確認方法

- 静的ファイル生成のみのため、ユニットテストは追加しない。
- `npm run build` 実行後、`/manifest.webmanifest` が正しいフィールドで生成されることを確認する。
- Chrome DevTools の Application タブでインストール可能性（Installability）が満たされていることを手動確認する。

## スコープ外

- Service Worker によるオフラインキャッシュ（ログイン必須コンテンツのキャッシュに関するセキュリティ検討が必要なため見送り）
- プッシュ通知
- Cookie ベースのテーマ切替と `viewport.themeColor` の完全連動
