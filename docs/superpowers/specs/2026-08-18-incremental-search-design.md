# 検索結果のインクリメンタル更新 設計書

日付: 2026-08-18
ステータス: 承認済み

## 背景と目的

`docs/superpowers/specs/2026-08-10-search-ui-feedback-design.md`で検索UIの実行中フィードバック・0件表示を改善したが、ユーザーから追加で「検索のときローディングアイコンをはさまずにリアルタイムに入れ替えたい」という要望があった。

ヒアリングの結果、これは以下を意味する。

- `/blog/search`ページに滞在している間、入力するたびに（送信ボタン/Enterを待たずに）結果がリアルタイムに絞り込まれる、いわゆるインクリメンタルサーチ。
- ページ遷移や`loading.tsx`のフォールバック表示を挟まない。
- 2026-08-10の設計書では「デバウンス・インクリメンタルサーチ…は現行のフォーム送信ベースの設計を維持する」として明示的にスコープ外としていたが、今回はこれを実装対象とする。

## 変更内容

### 1. `GET /api/blog`エンドポイントの拡張

`src/app/api/[[...route]]/route.ts`の既存の`/blog`ハンドラーはクエリパラメータを一切受け取っていない。`q`・`limit`を受け取り、`search/page.tsx`がサーバー側で行っているのと同じ`fetchBlogList`呼び出しに渡すよう拡張する。

```ts
app.get('/blog', async (c) => {
  const q = c.req.query('q');
  const limit = c.req.query('limit');
  try {
    const data = await fetchBlogList('blog', {
      q: q || undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return c.json(data);
  } catch {
    return c.json({ error: 'Not found' }, 404);
  }
});
```

既存のエラーハンドリング（`fetchBlogList`内部で`notFound()`が投げる例外をcatchして`404`を返す）はそのまま維持する。クエリパラメータ無しでの呼び出し（既存の呼び出し元がもしあれば）は`q`・`limit`とも`undefined`になり、既存動作と完全互換。

### 2. `SearchExperience`（新規Client Component）

既存の`SearchForm`・`ArticleCardList`と同じ場所（`src/features/blog/components/SearchExperience.tsx`、スタイルは`src/features/blog/styles/SearchExperience.module.css`）に新設する。このリポジトリの既存テスト（`tests/unit/features/blog/components/`）は全て`src/features/*/components/`配下のコンポーネントを対象にしており、`src/app/`配下のpage.tsx等を直接テストする前例はないため、テスト対象になるロジックを持つ`SearchExperience`は`features/blog/components/`に置き、既存の慣習に合わせる。`SearchForm`は**一切変更しない**（`/blog/`・`/blog/page/[num]`では今まで通り送信ベースの遷移を維持するため）。

```tsx
type Props = {
  initialKeyword: string;
  initialContents: BlogPost[];
  initialTotalCount: number;
};
```

`search/page.tsx`は次のように、これまで直接レンダリングしていた`SectionTitle`・`SearchForm`・`ArticleCardList`を`SearchExperience`に委譲する。

```tsx
export default async function Page({ searchParams }: Props) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? '';

  const { contents, totalCount } = (await fetchBlogList('blog', {
    q: keyword || undefined,
    limit: LIMIT,
  })) ?? { contents: [], totalCount: 0 };

  return (
    <>
      <Breadcrumb data={[...]} />
      <div className={styles.container}>
        <SearchExperience
          initialKeyword={keyword}
          initialContents={contents}
          initialTotalCount={totalCount}
        />
        <AsideMenu />
      </div>
    </>
  );
}
```

`SearchExperience`は既存の`<section>{...}</section>`（`SectionTitle`・入力欄・`ArticleCardList`を内包する）をそのままルート要素として返す。DOM構造・`layout.module.css`によるレイアウト（`AsideMenu`との横並び等）は現状から変化しない。`generateMetadata`（`<title>`等）は今まで通りサーバー側の初期`q`のみを見て決定し、入力中の値には追従しない（他の多くのインスタントサーチUIと同様、タブタイトルは更新しない）。

`SearchExperience`内部の責務:

- **入力欄・リセットボタン**: `SearchForm.module.css`を再利用し、見た目は既存の`SearchForm`と同一にする。ロジックは共有しない（新規に内部state管理）。
  - リセットボタンは既存の`SearchForm`と同じく`/blog/`へ`router.push`する（ページ内クリアではなく一覧へ戻る、という現状の挙動を維持）。
  - 送信（Enterキー/送信ボタン）は`preventDefault`のみでページ遷移はせず、下記の検索実行ロジック（ステップ3〜5）を、保留中の`setTimeout`があれば`clearTimeout`した上でデバウンスを待たずに即時実行する。呼び出す関数自体はデバウンス時と共通で、待ち時間の有無だけが異なる。
- **検索実行ロジック**: 入力値が変化するたび（1文字以上、trimして前回値と異なる場合）に以下を行う。
  1. `isFetching`を`true`にし、入力欄横のインジケータを表示する。
  2. 300ms デバウンスする（`setTimeout`。連続入力中は前回のタイマーを`clearTimeout`）。
  3. デバウンス確定時、直前の`fetch`が残っていれば`AbortController.abort()`で中断してから、新しい`AbortController`で`fetch('/api/blog?q=' + encodeURIComponent(trimmedValue) + '&limit=' + LIMIT, { signal })`を実行する（`trimmedValue`が空文字なら`q`パラメータを付けない）。
  4. レスポンスを`contents`・`totalCount`のstateに反映し、`isFetching`を`false`にする。中断（`AbortError`）は正常系として無視する。
  5. `router.replace(trimmedValue ? \`/blog/search?q=${encodeURIComponent(trimmedValue)}\` : '/blog/search', { scroll: false })`でURLを同期する（履歴には積まない）。
- **見出し**: `trimmedValue`が空なら「検索」、それ以外は「「`trimmedValue`」の検索結果：`totalCount`件」（`SectionTitle`にそのまま渡す、現行ロジックと同一）。
- **アクセシビリティ**: 視覚的に隠した`aria-live="polite"`領域を1つ設置し、結果件数が変わるたびに「`totalCount`件の検索結果」を読み上げさせる（スクリーンリーダー利用者が、視覚的な一覧の変化に気づけるようにするため）。

### 3. 微小インジケータのスタイル

新規CSS（`SearchExperience.module.css`）に、入力欄の横に置く小さな点滅ドットを追加する。`LoadingSpinner`とは別の、専用の軽量なCSSアニメーション（`opacity`の点滅、`position: static`でレイアウトに影響しないサイズ）。フェッチ中以外は`visibility: hidden`にしてレイアウトシフトを防ぐ。

## エラーハンドリング・エッジケース

- **fetch失敗**（ネットワークエラー・APIの404等）: `contents`/`totalCount`は直前の表示を維持したまま変更しない。インジケータの近くに小さく「検索に失敗しました」を表示する。ページ全体は壊れない。
- **`AbortController`による中断**は正常系として扱い、エラー表示はしない。
- **同一キーワードの再入力**は都度fetchし直す（キャッシュしない。YAGNI、レスポンスも軽量なため）。
- **JS無効環境**: SSR初回表示のみで以降は更新されない。特別な`noscript`対応はしない（既存の他ページと同じ前提）。
- **`/blog/`・`/blog/page/[num]`の既存の検索導線**: `SearchForm`が無変更のため、影響なし。

## テスト・確認方法

- **ユニットテスト（新規）**: `tests/unit/features/blog/components/SearchExperience.test.tsx`で、`fetch`・`next/navigation`の`useRouter().replace`・`ArticleCardList`/`SectionTitle`をモックし、フェイクタイマーでデバウンスを検証する。
  - 初期表示が`initialContents`/`initialTotalCount`と一致する。
  - 入力後300ms経過で正しいクエリ文字列を付けて`fetch`が呼ばれる。
  - fetch結果で`contents`/`totalCount`が更新される。
  - 入力を空にすると`q`なしでfetchし、見出しが「検索」に戻り、`router.replace`が`/blog/search`（パラメータなし）で呼ばれる。
  - fetch失敗時に直前の結果を保持したままエラーメッセージが表示される。
  - 連続入力時、古いリクエストの`AbortController.abort`が呼ばれる（最新の入力のみ反映される）。
- **`/api/blog`エンドポイント自体の自動テストは追加しない**（既存のAPI層に単体テストの前例がなく、MicroCMSクライアントの新規モックが必要になるため）。実際の疎通確認はe2eに委ねる。
- **既存e2e（`tests/e2e/blog/search.spec.ts`）**: `/blog/`からのEnter遷移など既存7ケースは`SearchForm`が無変更のため無影響。
- **新規e2e**: 「`/blog/search`滞在中に別キーワードを入力すると、ページ遷移なしに結果とURLが更新される」「0件になるキーワードを入力すると空メッセージが表示される」の2ケースを追加する。

## スコープ外

- **Server Actions方式**: このリポジトリでは`'use server'`が一箇所も使われておらず、既存の`fetch('/api/xxx')`パターン（`ContactForm`等）と一貫させるため今回は採用しない。
- **全記事の先読み＋クライアント側絞り込み**: 記事数が数十件規模（タグだけで31件以上）あり、本文まで含めた全文検索をクライアントで再現するのは非現実的なため不採用。
- **MicroCMSクエリの`fields`絞り込みによるペイロード削減**（`content`等カード表示に不要なフィールドを除外する最適化）: 有効な最適化だが今回のスコープには含めない。パフォーマンス上の問題が顕在化した場合に別途検討する。
- **`/blog/`・`/blog/page/[num]`ページへのインクリメンタルサーチ適用**: `/blog/search`ページ滞在中のみが対象。
- **検索結果のキーワードハイライト表示、サジェスト機能**（2026-08-10設計書から継続してスコープ外）。
