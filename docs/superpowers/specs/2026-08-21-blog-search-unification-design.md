# 投稿一覧ページと検索ページの統合（検索寄り） 設計書

日付: 2026-08-21
ステータス: 承認済み

## 背景と目的

現在、記事を閲覧する導線は`/blog/`（一覧・ページ送り）と`/blog/search`（検索、`docs/superpowers/specs/2026-08-18-incremental-search-design.md`でライブ検索化済み）の2つに分かれている。ユーザーから「投稿ページと検索ページを統合してはどうか、検索寄りで」という要望があった。

これは、`/blog/`自体に既存の`SearchExperience`（ライブ検索コンポーネント）を組み込み、一覧・検索・ページ送りを単一のライブUIに一本化することを意味する。`/blog/search`と`/blog/page/[num]`は個別のコンテンツを持たなくなり、`/blog/`へのリダイレクトのみを行うルートになる。

## 変更内容

### 1. ルーティング構成の変更

- **`/blog/`が唯一のエントリーポイントになる。** `?q=`（検索キーワード）と`?page=`（ページ番号、1始まり）を受け付け、サーバー側で初期`fetchBlogList`を行ってからクライアントに引き継ぐ（`/blog/search`と同じSSR＋クライアント引き継ぎパターン）。
- **`/blog/page/[num]/page.tsx`は`/blog/?page=${num}`へ恒久リダイレクトするだけのルートに変える**（`num === '1'`なら`/blog/`へ）。`generateStaticParams`によるSSGは廃止する。
- **`/blog/search/page.tsx`も同様に`/blog/?q=${q}`へ恒久リダイレクトするだけのルートに変える**（`q`未指定なら`/blog/`へ）。付随する`src/app/(login)/blog/search/loading.tsx`は実コンテンツを描画しなくなるため削除する。
- **`/blog/`は静的生成(SSG)から動的レンダリングに変わる**（`searchParams`を読むため）。これは`/blog/search`で既に受け入れたトレードオフと同じであり、新たに発生する問題ではない。初回アクセス時のSuspenseフォールバック用に`src/app/(login)/blog/loading.tsx`を新設し、既存の`LoadingSpinner`の`fullscreen={false}`バリアント（`docs/superpowers/plans/2026-08-16-search-ui-feedback.md`で追加済み）を使う。
- **`/blog/archive/[year]`・`/blog/tags/[tagId]`・`/blog/categories/[catId]`とそれぞれの`page/[num]`は今回のスコープ外。** 静的ページ・`Pagination`の`<Link>`遷移のまま変更しない。

### 2. `SearchExperience`の拡張

`src/features/blog/components/SearchExperience.tsx`にページ状態を追加する。コンポーネント名・配置場所は変更しない。

```tsx
type Props = {
  initialKeyword: string;
  initialPage: number;
  initialContents: BlogPost[];
  initialTotalCount: number;
};
```

- **状態**: `keyword`・`page`・`contents`・`totalCount`・`isFetching`・`hasError`（`page`が新規追加）。
- **検索実行ロジックの一般化**: `runSearch(value, page)`のように、キーワードとページ番号を両方受け取る形にする。`/api/blog?q=...&limit=12&offset=${(page-1)*12}`をfetchする（`GET /api/blog`エンドポイントに新たに`offset`クエリパラメータを追加し、`fetchBlogList`にそのまま渡す）。
- **キーワード変更時**（デバウンス300ms、既存通り）: `page`を1にリセットしてから`runSearch(value, 1)`を呼ぶ。
- **ページ番号クリック時**（新規、デバウンスなし・即時）: `keyword`はそのまま、`runSearch(keyword, newPage)`を即座に呼ぶ。
- **URL同期**: `window.history.replaceState`で`?q=`と`?page=`を組み立てる（`q`が空文字なら省略、`page`が1なら省略）。例: `/blog/?q=Next.js&page=2`、キーワードなし1ページ目なら`/blog/`。
- **見出し**: キーワードありなら「「keyword」の検索結果：N件」、なしなら「投稿」。
- **`Pagination`をこのコンポーネント内に描画し**、ページ番号クリックのコールバックを渡す（詳細はセクション3）。
- **リセットボタンの挙動を簡略化する**: `/blog/search`が独立ページだった頃は「リセット＝`/blog/`へページ遷移」だったが、統合後は`/blog/`自体がこのコンポーネントなので実ページ遷移は不要になる。キーワードを空にして`page`を1に戻し、既存のライブ更新の仕組み（`runSearch('', 1)`）をそのまま呼ぶだけでよい。これにより`SearchExperience`から`useRouter`/`push`への依存自体が無くなる。
- **fetch失敗時の挙動・`AbortController`によるページ送り/検索間の競合制御**は`2026-08-18-incremental-search-design.md`で実装済みのロジックをそのまま流用し、変更しない。

### 3. `Pagination`コンポーネントの改修

`src/features/blog/components/Pagination.tsx`はアーカイブ・タグ・カテゴリページでも使われており、そちらは実ページ遷移のまま変更しないため、後方互換なオプトイン方式にする。

```tsx
type PaginationParam = {
  pager: {
    totalCount: number;
    limit: number;
    currentPage?: number;
  };
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  };
  onPageChange?: (page: number) => void;
};
```

- `onPageChange`が渡された場合のみ、ページ番号を`<Link href=...>`ではなく`<button onClick={() => onPageChange(page)}>`として描画する（`urlPath`の計算・省略記号(`...`)・現在ページのハイライト等の表示ロジックは共通のまま）。
- `onPageChange`が渡されない場合（アーカイブ・タグ・カテゴリページ）は現状と完全に同じ`<Link>`ベースの実装のまま。
- ボタンの見た目は既存の`.pageLink`スタイルをそのまま使い、視覚的な違いは出さない。

`SearchExperience`は`<Pagination pager={{ totalCount, limit: LIMIT, currentPage: page }} onPageChange={(p) => runSearch(keyword, p)} />`のように呼び出す。

### 4. SEO・メタデータ・リダイレクト

- **`/blog/page.tsx`の`generateMetadata`**: `searchParams`から`q`・`page`を読み、タイトルを`keyword ? 「${keyword}」の検索結果 : (page > 1 ? ${page}ページ目 | 投稿 : 投稿)`のように出し分ける。
- **`robots`**: キーワードあり（`q`が空でない）は`{ index: false }`（`/blog/search`と同じ、検索結果ページは非インデックス）。キーワードなしでページ2以降は`'index, follow'`（`/blog/page/[num]`と同じ、ページ送りコンテンツは引き続きインデックス対象）。キーワードなしページ1はデフォルト（インデックス対象、`robots`指定なし）。
- **`alternates.canonical`**: キーワードなしページ2以降は`/blog/?page=${page}`を自己canonical化（`/blog/page/${num}/`と同等の扱いを維持）。キーワードあり・ページ1は`/blog/`。
- **`/blog/page/[num]/page.tsx`**: `next/navigation`の`permanentRedirect(`/blog/?page=${num}`)`（内部的に308リダイレクトを返す）を呼ぶ（`num === '1'`なら`permanentRedirect('/blog/')`）。
- **`/blog/search/page.tsx`**: 同様に`q`を読み、`permanentRedirect(`/blog/?q=${encodeURIComponent(q)}`)`（`q`未指定なら`permanentRedirect('/blog/')`）。
- **`sitemap.ts`は変更不要**（`/blog/page/[num]`は元々sitemapに含まれていない）。

### 5. エラーハンドリング・エッジケース

- **`page`パラメータの検証**: `/blog/page.tsx`（Server Component）が`searchParams`から`page`を読み取る箇所で、`?page=abc`や`?page=0`など不正な値は`1`にフォールバックしてから`initialPage`として`SearchExperience`に渡す（`SearchExperience`側の`runSearch`は常に検証済みの数値を受け取るため、クライアント側での再検証は不要）。範囲外（総ページ数を超える`page`）はMicroCMSの`offset`が空配列を返すだけなので、下記の空状態表示でカバーする。
- **空状態表示を拡張する**: 現行の`ArticleCardList`の`emptyMessage`は「キーワードがあるときだけ」表示していたが、統合後は「0件のとき」全般に広げる。キーワードありなら現行通り「「X」に一致する記事が見つかりませんでした。」、キーワードなし（＝ページ範囲外など）なら「記事が見つかりませんでした。」を表示する。この判定・出し分けは`SearchExperience`が`emptyMessage`propの値を決める箇所で行い、`ArticleCardList`自体は変更しない。

## テスト・確認方法

- **`SearchExperience.test.tsx`**: `page`/`onPageChange`関連のテストを追加（ページ送りクリックで正しい`offset`付きURLをfetch、キーワード変更時に`page`が1にリセットされる）。リセットボタンのテストは`router.push`のモック確認から「内部stateがクリアされ`runSearch('', 1)`相当の結果になる」確認に書き換える（`useRouter`への依存自体がなくなるため）。
- **`Pagination.test.tsx`**: `onPageChange`を渡した場合に`<Link>`ではなく`<button>`が描画されクリックでコールバックが呼ばれることを追加。既存の`<Link>`ベースのテスト（アーカイブ・タグ・カテゴリ向け）はそのまま変更なしで残す。
- **`tests/e2e/blog/list.spec.ts`**: `/blog/`がライブ検索・ライブページ送りの主体になるため、「検索キーワードを入力すると結果が絞り込まれる」「ページ番号クリックで遷移せず次ページが表示される」「0件になるキーワードで空メッセージが表示される」を追加する。
- **`tests/e2e/blog/search.spec.ts`**: `/blog/search`は中身を持たなくなるため、既存の内容系テストの大半は上記`list.spec.ts`に統合・移設し、このファイルは「`/blog/search?q=X`が`/blog/?q=X`へリダイレクトされ内容が表示される」「`/blog/search`（キーワードなし）が`/blog/`へリダイレクトされる」のリダイレクト確認用に絞る。
- **`/blog/page/[num]`のリダイレクト**も同様に軽量な確認テストを追加する（`/blog/page/2/`→`/blog/?page=2`）。
- **`ArticleCardList.test.tsx`・`/api/blog`エンドポイント自体**は変更不要（APIルート自体への自動テストは追加しない方針を踏襲）。

## スコープ外

- `/blog/archive/[year]`・`/blog/tags/[tagId]`・`/blog/categories/[catId]`とそれぞれの`page/[num]`への同様の統合。
- 検索結果のキーワードハイライト表示、サジェスト機能（`2026-08-10`設計書から継続してスコープ外）。
- MicroCMSクエリの`fields`絞り込みの見直し（`2026-08-18`設計書で`/blog/`・`/api/blog`双方に`fields: 'id,title,eyecatch,publishedAt,updatedAt'`を適用済み。今回`offset`パラメータを追加するのみで、`fields`指定はそのまま維持する）。
