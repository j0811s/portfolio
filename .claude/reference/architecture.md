# アーキテクチャ

## ルートグループと認証

`src/proxy.ts` の Next.js ミドルウェアが全ルートを保護し、未認証リクエストを `/auth` にリダイレクトする。認証の対象外にするパスは `matcher` の否定先読みに列挙するが、前方一致で公開範囲が広がらないよう、ディレクトリは `api/|api$` のように「`/` か終端」、ファイルは `sw\\.js$` のように「`.` をエスケープして終端」で区切る（`_next/static/`・`_next/image` もディレクトリと同じ扱い）。対象外のパスそのものは未ログインで取得でき、同じ文字列で始まる別のパスや `.` を置き換えたパスは `/auth` へリダイレクトされることを `tests/e2e/guest/proxy-matcher.spec.ts` で検証しており、matcher を変更したらこのテストの一覧も更新する。

ルートグループは2つ：

- `src/app/(login)/` — 認証必須。コンテンツページやブログ全般
- `src/app/(logout)/` — 公開。`/auth` ログインページのみ

next-auth の `SessionProvider` はどこにも置いていない。クライアント側でセッションを参照する箇所（`useSession`・`getSession`・`signOut` 等）が無く、`next-auth/react` の利用はログインフォームの `signIn`（Provider 不要）のみのため。`SessionProvider` はマウント時に `/api/auth/session` を取得し、ログイン画面では `signIn` と並行すると CSRF Cookie が上書きされて CSRF 検証に失敗する原因にもなっていた（PR #19）。セッションが必要になった場合は Provider を追加するより、Server Component で `getServerSession(authOptions)` を使う。

`LoginForm` は送信中の再送信を禁止し、NextAuth が CSRF 検証失敗を `ok: true` の `signin?csrf=true` で返すケースもエラーとして表示する。

認証は NextAuth v4 の Credentials プロバイダー（`src/app/api/auth/[...nextauth]/route.ts`）で処理し、`AUTH_USERNAME` / `AUTH_PASSWORD` 環境変数を照合する。セッションは JWT 戦略（`maxAge` は開発: 60分、本番: 24時間）。

## API レイヤー（Hono）

カスタム API ルートは `src/app/api/[[...route]]/route.ts` の単一 Hono アプリにまとめられている。エンドポイント：

- `GET /api/blog` — ブログ一覧
- `GET /api/blog/:id` — ブログ詳細
- `GET /api/skills` — スキル一覧
- `GET /api/draft` — Next.js ドラフトモード有効化、`draft_key` Cookie をセット、`/blog/:id/preview/` にリダイレクト
- `GET /api/draft/disable` — ドラフトモード無効化
- `POST /api/contact` — お問い合わせメール送信（`getServerSession` による認証必須、Resend 経由で送信）。Resend クライアントはリクエスト時に生成し、`RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `CONTACT_TO_EMAIL` のいずれかが未設定なら 500 を返す（未設定の変数名をログ出力）。キー未設定の環境（Vercel Preview など）でもビルドは通る。ボディは `src/libs/contact/validateContact.ts`（クライアントの `ContactForm` と共有するルール: 全フィールド文字列・空白のみ不可・メール形式・文字数上限・`name`/`email`/`subject` の改行禁止）で検証し、不正なら 400 を返す。`resend.emails.send` の戻り値 `error` と reject の両方を 500 `{ error: 'Failed to send email' }` で返し、入力値を含まない形でログ出力する

`/api/blog`・`/api/blog/:id`・`/api/skills` の取得エラーは `respondFetchError` にまとめている。取得関数が `notFound()` を投げた場合（microCMS の 400 / 404）だけ 404 `{ error: 'Not found' }` を返し、それ以外（5xx・429・ネットワークエラーなど）は上流の障害として 502 `{ error: 'Failed to fetch' }` を返して、エンドポイント名とエラーメッセージをログに出す（検索語などリクエストの中身は含めない）。`notFound()` の判定には Next.js 内部の `isHTTPAccessFallbackError`（`next/dist/client/components/http-access-fallback/http-access-fallback`）を使っているため、Next.js を更新したら `tests/unit/app/api` の「本物の `notFound()`」のテストで壊れていないことを確認する。検索画面（`SearchExperience`）は 200 以外をすべて「検索に失敗しました。」と表示する。

API ルートはミドルウェアの `matcher` 対象外のため認証されない。認証が必要なエンドポイントはハンドラー内で `getServerSession(authOptions)` を呼んでセッションを確認する。

## MicroCMS データ取得

ブログとスキルのデータは `src/libs/microcms/` 経由で MicroCMS から取得する（`blog.ts` と `skill.ts` の2クライアント）。ブログ記事・アーカイブ・カテゴリ・タグ別一覧は `generateStaticParams` による SSG + ISR（`revalidate = 3600`）、トップページも ISR（`revalidate = 3600`）。`revalidate` を付けないページはビルド時の内容に固定され、microCMS で公開終了にした記事が次のデプロイまで残るため、microCMS のデータを表示するページには必ず付ける。1レンダリング内の重複リクエストは React `cache()` で排除している。

サイドメニュー（`AsideMenu`）が使う全記事の id・カテゴリ・タグ・公開日は `fetchBlogSummaryAll`（`blog.ts`）で取得し、`unstable_cache`（`revalidate: 3600`）で Next.js のデータキャッシュに保存する。`AsideMenu` は記事詳細とアーカイブ・カテゴリ・タグ別一覧のすべてのページで描画され、`cache()` では1ページの中でしか重複を除けないため、以前はページの数だけ全件取得を繰り返してビルド中に microCMS のレート制限（429）に当たることがあった（#72）。ビルドでは並列ワーカーの最初の数回だけ取得され、microCMS へのリクエストは 430 → 194 に減った。キャッシュが無いときの失敗は保存されずに投げ直される（ビルドの失敗、またはエラー画面）。期限切れのキャッシュがあるときは、再取得に失敗しても Next.js が `console.error`（`revalidating cache with key: ...`）に記録して古い集計を返す。`handleMicroCMSError` は通さず、400 / 404 も `notFound()` にせず投げ直す（全件の集計は個別のページではないため。`notFound()` にするとサイドメニューのある全ページが 404 になる）。ドラフトモードでは `unstable_cache` は使われない（Next.js の仕様）。キャッシュはデプロイをまたいで残るため、サイドメニューと `page/[num]` の生成ページ数は、再デプロイの直後も含めて最大で `revalidate` の分だけ古い集計になりうる（生成されなかったページはアクセス時に生成される）。

アーカイブ・カテゴリ・タグ別一覧の `page/[num]` は、`fetchBlogSummaryAll` の結果から年・カテゴリ・タグごとの記事数を数えて、記事数に応じたページだけを `generateStaticParams` で生成する（記事の無いものは1ページ目だけ。#65）。ページ番号の計算は `src/libs/blog/pagination.ts` にまとめており、1 以上の整数でない番号は microCMS に問い合わせる前に、記事数を超える番号は取得結果の `totalCount` で判定して `notFound()` にする（ビルド後に記事が減った場合や URL の直接入力のため）。年別アーカイブは年を 4 桁の数字に限り（`20` のような部分一致を防ぐ）、記事の無い年は `notFound()` にする（年は記事の公開日から作るため。年ごとの集計は `src/libs/blog/countPostsByYear.ts` でサイドメニューと共有）。タグ・カテゴリー・年別一覧の URL（パンくずリスト・JSON-LD・canonical）は `src/libs/blog/listPath.ts` の `listPath` で組み立て、手書きしない（手書きで ID や年が抜けていた。#64）。`page/[num]` の canonical は、1 ページ目は一覧の先頭（同じ内容のため。`noindex` も付ける）、2 ページ目以降は自身を指す。

取得関数（`fetchBlogList`・`fetchBlogDetail`・`fetchSkillAll`。全件の集計 `fetchBlogSummaryAll` は前述のとおり通さない）の `catch` は `src/libs/microcms/handleMicroCMSError.ts` に集約しており、microCMS が 400 / 404 を返したときだけ `notFound()` にし（400 はコード側の fields / filters の誤りでも返るため `console.warn` でリクエスト先を記録する。filters に検索語が入るため、記録するのはパスとクエリのパラメータ名だけで値は出さない）、それ以外（5xx・429・ネットワークエラー・401/403）は投げ直す。一時的な障害まで `notFound()` にすると ISR の再生成で 404 が正常な結果としてキャッシュされ、最大1時間 404 のままになるため（#63）。投げ直せば再生成は失敗扱いになり、前回のページが出続ける。キャッシュの無いページやビルド時はエラーになる（ビルド時は SDK の再試行2回のあとビルドが失敗する）。

リクエスト時のエラーは `src/app/(login)/error.tsx` が受け止め、ヘッダー・フッターを残したまま 500 の画面（`retry()` による再試行と、トップページへのリンク）を出す。エラーメッセージは表示せず、サーバーログと照合できる `digest` だけを出す。`src/app/layout.tsx` と `(login)/layout.tsx` はデータを取得しないので `global-error.tsx` は置いていない。`error.tsx` は同じセグメントの `layout.tsx` のエラーを受け止めないため、`(login)/layout.tsx` に取得処理を足すなら `global-error.tsx`（または上位の `error.tsx`）が必要になる。ISR のキャッシュがあるページは、再生成に失敗しても前回のページが出続ける（エラー画面はキャッシュされない。#69 で本番ビルドにより確認済み）。

## ブログ一覧・検索の統合

`/blog/` は `?q=`（検索キーワード）・`?page=`（ページ番号）を受け付ける唯一のブログ一覧エントリーポイントで、`src/features/blog/components/SearchExperience.tsx`（Client Component）が入力・ページ送りの両方をデバウンス付きの `/api/blog` フェッチと `window.history.replaceState` によるURL同期でライブに処理する（`next/navigation` のナビゲーションは発生しない）。`/blog/page/[num]` と `/blog/search` は `permanentRedirect` によって `/blog/` へのリダイレクトのみを行う薄いルートになっている。

`src/app/(login)/blog/loading.tsx` はNext.jsのファイル規約上、`/blog/` 自身だけでなく `/blog/[postId]`・`/blog/archive/*`・`/blog/tags/*`・`/blog/categories/*` とそれぞれの `page/[num]` など、配下の全ルートの遷移時フォールバックにもなる（`loading.tsx` はそのセグメント以下の子ルート全てをSuspense境界でラップするため）。これにより、これらのページへの遷移時もルート直下の `src/app/loading.tsx`（ヘッダー・フッターごと覆う全画面オーバーレイ）ではなく、ヘッダー・フッターを残した狭いフォールバックに変わる。意図して設計した副作用ではなく、`/blog/` の統合ページ化に伴う波及効果だが、個別に切り分けるにはルートグループの再編が必要になる規模のため、現状は許容している。

## ブログコンテンツのレンダリング

MicroCMS から取得したブログ記事の HTML は `html-react-parser` でレンダリングする。`ArticleDetail` は `<pre>` ブロックを `highlight.js`（自動検出モード）でシンタックスハイライトした出力に置き換える。コードのファイル名は親要素の `data-filename` 属性から読み取る。

目次（ToC）は `src/libs/blog/extractToc.ts` で生の HTML から正規表現により `id` 属性を持つ `<h2>`〜`<h3>` タグを抽出して生成する。

## テーマシステム

ダーク/ライトテーマは Cookie（`theme=light|dark`）に保存する。FOUC を防ぐため、`src/app/layout.tsx` のインラインスクリプトが React ハイドレーション前に Cookie を読み取り `<html>` の `data-theme` をセットする。ハイドレーション後は `ThemeProvider`（`src/features/theme/`）が Jotai の `themeAtom` と Cookie・DOM を同期する。

色は `src/styles/index.css` の CSS 変数で、ライト・ダーク（`data-theme` と `prefers-color-scheme` の両方）ごとに定義する。文字色は WCAG AA（4.5:1）を満たすよう、控えめな文字は `opacity` で薄くせず `--text-secondary` を、ブランドカラー（`--theme-primary`）の背景に載せる文字は `--text-on-theme-primary` を使う。

## フィーチャー構成

`src/features/` はドメインごとに分割されている。各フィーチャーは `components/` と `index.ts` バレルエクスポートを持ち、必要に応じて `styles/`・`hooks/`・`stores/`・`types/` を含む。

| フィーチャー | 概要                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| `blog/`      | 記事一覧・詳細・カテゴリ・タグ・検索・アーカイブ・ToC・シンタックスハイライト。アーカイブ・カテゴリ・タグ別一覧ページは `BlogListLayout` で共通化 |
| `contact/`   | お問い合わせフォーム（react-hook-form）。`POST /api/contact` へ送信し Resend でメール配信 |
| `hero/`      | トップページのヒーローセクション（スキルアイコンをランダム表示）。アニメーションは `motion` を `LazyMotion`（`domAnimation`）+ `m` で読み込む |
| `skills/`    | スキルセット一覧                                                                          |
| `header/`    | グローバルヘッダー                                                                        |
| `footer/`    | グローバルフッター（ナビゲーション・PageTop）                                             |
| `theme/`     | ダーク/ライトテーマ切替（Jotai + Cookie）                                                 |
| `skeleton/`  | ローディングスケルトン                                                                    |
| `not-found/` | 404 ページ（`src/app/not-found.tsx`）のターミナル演出。`NotFoundTerminalClient` が `dynamic(..., { ssr: false })` で `TerminalWindow`（`src/components/ui/`。`@wterm/react` + `@wterm/just-bash`）をブラウザだけで読み込む。`styles/` は持たない（ページのレイアウトは `src/styles/pages/not-found.module.css`、ターミナルの見た目は `src/components/styles/ui/TerminalWindow.module.css`） |

## SEO

JSON-LD 構造化データは `src/libs/seo/jsonLd.ts` で生成（WebSite・BreadcrumbList・BlogPosting）し、`<JsonLd>` コンポーネント経由で注入する。値は microCMS の記事データ由来のため、`<JsonLd>` は `<` を `\u003c` にエスケープして `</script>` で script 要素を抜けられないようにしている。パンくずリストの `ListItem.item` は、`createBreadcrumbJsonLd` が相対パスを `SITE_URL` で絶対 URL にする（JSON-LD には canonical と違い `metadataBase` が効かないため）。各ページのメタデータは `src/app/layout.tsx` のルート `metadata` エクスポートをスプレッドして構成する。

OG 画像（各 `opengraph-image.tsx`、`next/og` の `ImageResponse`）は Node.js Runtime で生成する（Edge Runtime は Next.js で非推奨のため使わない）。

`src/app/sitemap.ts` — MicroCMS の記事・カテゴリ・タグを取得して `/sitemap.xml` を動的生成（`revalidate = 3600`）。認証ミドルウェアの対象のままで、未ログインでは取得できない（サイト全体がログイン必須でクローラーは中身を読めず、記事 ID・カテゴリ・タグの一覧を外部に出さないため）。そのため `robots.txt` に `Sitemap:` 行は出さない。
`src/app/robots.ts` — 全クローラーは `/api/`・`/auth/`・`/blog/*/preview/` を拒否。主要 AI クローラー（GPTBot・Google-Extended・ClaudeBot 等 6種）はサイト全体を拒否。`robots.txt` は認証ミドルウェア（`src/proxy.ts` の `matcher`）から除外しており、未ログインのクローラーも取得できる。

## フォント

M PLUS Rounded 1c と JetBrains Mono は `src/app/layout.tsx` で `next/font/google` により読み込み（ビルド時に自己ホスト、外部の Google Fonts へはリクエストしない）、`<html>` に付けた CSS 変数 `--font-m-plus-rounded` / `--font-jetbrains-mono` を `src/styles/index.css` の `--font-sans` / `--font-mono` から参照する。M PLUS Rounded 1c は日本語グリフが unicode-range で分割配信されるため `preload: false`。

## react-doctor

`npx -y react-doctor@latest . --verbose` の指摘は 0 件を維持する。誤検知・意図的なものは該当行の直前に `react-doctor-disable-next-line <rule> -- <理由>` を書いて抑制する（現在 6 箇所: `LoginForm` の callbackUrl、`offline/page.tsx` の a 要素、`site.ts` の `new URL`、`SearchExperience` の effect 内取得、`PageTop` / `DrawerMenu` のポータル先 `document.body`）。

## PWA

`src/app/manifest.ts` — `sitemap.ts` / `robots.ts` と同じファイル規約で `/manifest.webmanifest` を生成し、ホーム画面への追加・スタンドアロン起動を可能にする。`shortcuts` により、ホーム画面アイコン長押しメニューからブログ一覧・検索・スキル一覧・お問い合わせへ直接遷移できる。アイコンは `purpose: 'any'`（`icon-192.png` / `logo.png`）と `purpose: 'maskable'`（`icon-maskable-512.png`）を別ファイルに分けている。maskable用はOSのマスク形状（丸型・角丸など）で端が切り取られてもロゴが欠けないよう、セーフゾーン（中央80%円）内に収めた上で背景色（`background_color`）を全面に敷いた専用画像。マニフェスト本体と、そこが参照する `public/icon-192.png` / `public/icon-maskable-512.png` / `public/logo.png` は認証ミドルウェア（`src/proxy.ts` の `matcher`）から除外しており、未ログイン状態でも取得できる。`layout.tsx` の `viewport.themeColor` は OS のカラースキーム（`prefers-color-scheme`）に連動し、サイト内の Cookie ベースのテーマ切替とは独立している。

`public/sw.js` は外部依存のない手書きの Service Worker で、`layout.tsx` のインラインスクリプト（テーマ初期化スクリプトと同じパターン）から登録される。キャッシュは用途別に2系統に分離している。

- `precache-v1`（install時に確定）: `/offline/` とその `<link rel="stylesheet">`（ビルド毎にファイル名がハッシュ化されるため、キャッシュ済みHTMLから実際のhrefを読み取って動的に取得する）、`icon-192.png`。オンラインで一度も `/offline/` を開いたことがなくても、初回オフライン時からフォールバックページがスタイル込みで表示される。
- `runtime-v1`（`/_next/static/*` の cache-first ランタイムキャッシュ）: コンテンツハッシュ付きで実質不変だが、デプロイの度に新しいファイルが積み上がり続けるため、件数上限（`MAX_RUNTIME_ENTRIES`）を超えたら挿入順で古いエントリから間引く。`activate` イベントのクリーンアップは `precache-v1` / `runtime-v1` 以外のキャッシュ名を削除する。

ページ遷移は network-first でオフライン時に `precache-v1` の `/offline/`（`src/app/offline/page.tsx`。共通ヘッダー・フッターや MicroCMS 依存を持たない独立したページ）にフォールバックする。ページ本文や API レスポンスはキャッシュしない。`offline` と `sw.js` も `manifest.webmanifest` / アイコン群と同様に認証ミドルウェアの `matcher` から除外している。

## 依存パッケージの overrides

`package.json` の `overrides` で `guarded-fetch` 配下の `undici` を `7.30.2` に固定している（#54）。`just-bash@3.6.0` が依存する `guarded-fetch@0.1.3` は `undici@7.29.0` を固定で要求し、`npm audit` に high（GHSA-r53p-7pc4-xj5r など、修正は 7.30.1 以降）が出るため。`just-bash` は 404 ページのターミナル演出でブラウザ内だけで使い、ブラウザ用バンドルは `undici` を読み込まないので実害はない。`just-bash` の更新で `guarded-fetch` が `undici` 7.30.1 以降を要求するようになったら、この overrides を削除する（残すと上流の新しい `undici` を古い版に押し戻してしまう）。

## Lint・フォーマット

Biome（`biome.json`）で lint とフォーマットを一元管理する。ESLint は使用していない。husky + lint-staged により `git commit` 時に `src/` 以下のステージ済みファイルへ自動実行される。`.ts/.tsx` はフォーマット後に lint チェック、`.css` は同様。lint エラーはコミットをブロックし、自動修正は行わない。フォーマットのみ自動修正される。

## テスト構成

- **ユニットテスト**: Vitest + jsdom。`tests/unit/` 以下に配置。セットアップファイルは `tests/unit/setup.ts`。
- **e2e テスト**: Playwright。`tests/e2e/` 以下に配置。`.env.local` から `AUTH_USERNAME` / `AUTH_PASSWORD` を読み込む。
  - `auth.setup.ts` でログインし、ストレージ状態を `playwright/.auth/storageState.json` に保存する。
  - ほとんどのテストプロジェクトは `setup` に依存し、そのストレージ状態を使用する。
  - `guest` プロジェクトのみ認証状態なしで `auth/page.spec.ts` と `tests/e2e/guest/` 配下を実行する（`playwright.config.ts` の `GUEST_SPECS`。ログイン済みプロジェクトからは除外）。
  - テスト対象のサーバーは、毎回 `next build` した本番ビルドを e2e 専用ポート 3100 で `next start` する（`reuseExistingServer: false`）。開発サーバーは初回アクセス時のコンパイル待ちで `page.goto` がタイムアウトしやすいため使わない。`next dev` は `.next/dev` を使うので、開発サーバーを起動したままでも e2e を実行できる。
  - e2e 用サーバーの環境変数で `NODE_ENV=production`（dotenv で読み込んだ `.env.local` の値が引き継がれるとビルドが失敗するため）、`RESEND_API_KEY` を空（モックが外れても本物のメールを送らない）、`GA_ID`・`GTM_ID` を空（本番のアナリティクスにテストのページビューを送らない。外部スクリプトで load が遅れるのも防ぐ）、`NEXTAUTH_URL` を 3100 に上書きする。
  - `serviceWorkers: 'block'` を既定にしている。Service Worker がページを制御すると `page.route` のモックがすり抜け、実 API にリクエストが届くため（オフラインのテストのみ `test.use({ serviceWorkers: 'allow' })`）。
  - retries は使わない（不安定さを隠さない）。失敗時は `trace: 'retain-on-failure'` でトレースを残す。
