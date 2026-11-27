import { cookies, draftMode } from 'next/headers';
import { Hono, type Context } from 'hono';
import { handle } from 'hono/vercel';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route';
import { fetchBlogList, fetchBlogDetail } from '@/src/libs/microcms/blog';
import { fetchSkillAll } from '@/src/libs/microcms/skill';
import { buildSearchFilters } from '@/src/libs/blog/buildSearchFilters';
import { validateContact } from '@/src/libs/contact/validateContact';
// next/navigation の unstable_rethrow も内部で使っている判定関数。公開 API ではないため、
// Next.js の更新で壊れていないことを tests/unit/app/api の「本物の notFound()」のテストで確かめる
import {
  getAccessFallbackHTTPStatus,
  isHTTPAccessFallbackError,
} from 'next/dist/client/components/http-access-fallback/http-access-fallback';

const app = new Hono({ strict: false }).basePath('/api');

/**
 * microCMS の取得関数が投げたエラーを API のレスポンスに変換する。
 *
 * 取得関数は microCMS の 400 / 404 を `notFound()` に変換して投げる（handleMicroCMSError）ので、それだけを 404 にする。
 * それ以外（5xx・429・ネットワークエラーなど）は上流の障害なので 502 を返し、原因を追えるようログに残す。
 * ログには検索語などリクエストの中身を含めない（SDK のエラーメッセージはステータスと microCMS の応答文だけで、
 * リクエスト URL は含まない。400 のときの handleMicroCMSError の警告ログもクエリの値は出さない）。
 */
const respondFetchError = (c: Context, endpoint: string, error: unknown) => {
  if (isHTTPAccessFallbackError(error) && getAccessFallbackHTTPStatus(error) === 404) {
    return c.json({ error: 'Not found' }, 404);
  }

  // SDK のメッセージは改行を含む（`status: N\n  message is ...`）ため、ログが1行に収まるよう空白にまとめる
  const detail = (error instanceof Error ? error.message : String(error)).replace(/\s+/g, ' ');
  console.error(`[${endpoint}] microCMS からの取得に失敗しました: ${detail}`);
  return c.json({ error: 'Failed to fetch' }, 502);
};

/** クエリの整数が不正なことを表す値（未指定の `undefined` と区別する） */
const INVALID_QUERY = Symbol('invalid query');

/**
 * クエリの値を範囲付きの整数として読む。未指定・空文字は `undefined`（microCMS の既定値を使う）。
 *
 * `Number()` は `'1e2'` を 100、`' 1'` を 1、`'1.5'` を 1.5 にするため、先に文字列の形（`0` か `1-9` で始まる数字の並び）で
 * 確かめる。範囲外や形が違う値は microCMS に送ると 400 になり、`notFound()` 経由で 404 を返してしまうため（#73）、
 * 呼び出し側で 400 を返して microCMS には送らない。
 */
const parseIntegerQuery = (
  value: string | undefined,
  { min, max = Number.MAX_SAFE_INTEGER }: { min: number; max?: number }
): number | undefined | typeof INVALID_QUERY => {
  if (value === undefined || value === '') return undefined;
  if (!/^(0|[1-9]\d*)$/.test(value)) return INVALID_QUERY;
  const number = Number(value);
  return number >= min && number <= max ? number : INVALID_QUERY;
};

// microCMS のコンテンツ ID に使える文字は英大小文字・数字・`-`・`_` のみ（「コンテンツIDの設定」）で、
// リダイレクト先パスや Cookie 値に `/`・`..`・`;`・改行等が混入するのを防ぐ。
// 文字数は API 側で設定しない限り無制限のため、実運用で十分な上限として 100 文字を設ける。
// draftKey の形式は公開仕様が無いため、実際の値（英数字）を包含する同じパターンで検証する。
const DRAFT_PARAM_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;

// プレビュー用
app.get('/draft', async (c) => {
  const id = c.req.query('id');
  const draftKey = c.req.query('draftKey');

  if (!id || !draftKey) {
    return c.text('id and draftKey are required', 400);
  }

  if (!DRAFT_PARAM_PATTERN.test(id) || !DRAFT_PARAM_PATTERN.test(draftKey)) {
    return c.text('invalid id or draftKey', 400);
  }

  const draft = await draftMode();
  draft.enable();

  const cookieStore = await cookies();
  cookieStore.set('draft_key', draftKey, {
    httpOnly: true,
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'lax',
  });

  return c.redirect(`/blog/${id}/preview/`);
});

// プレビュー解除用
app.get('/draft/disable', async (c) => {
  const draft = await draftMode();
  draft.disable();

  const cookieStore = await cookies();
  cookieStore.delete('draft_key');

  return c.redirect('/');
});

// ブログ一覧
app.get('/blog', async (c) => {
  const q = c.req.query('q');
  // limit は microCMS の上限の 100 まで（検索画面は LIMIT の 12 件ずつ取得する）。0 は件数だけを返す値で
  // （SDK の getAllContents が totalCount の取得に使う）、検索画面では使わないので受け付けない。
  // offset の上限は設けない（記事数を超えれば空の一覧が返るだけで、1 リクエストが 1 回の取得になるだけのため）
  const limit = parseIntegerQuery(c.req.query('limit'), { min: 1, max: 100 });
  const offset = parseIntegerQuery(c.req.query('offset'), { min: 0 });
  if (limit === INVALID_QUERY || offset === INVALID_QUERY) {
    return c.json({ error: 'Invalid query' }, 400);
  }
  try {
    const data = await fetchBlogList('blog', {
      filters: buildSearchFilters(q ?? ''),
      limit,
      offset,
      fields: 'id,title,eyecatch,publishedAt,updatedAt',
    });
    return c.json(data);
  } catch (error) {
    return respondFetchError(c, '/api/blog', error);
  }
});

// ブログ詳細
app.get('/blog/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const data = await fetchBlogDetail('blog', id);
    return c.json(data);
  } catch (error) {
    return respondFetchError(c, '/api/blog/:id', error);
  }
});

// スキル一覧
app.get('/skills', async (c) => {
  try {
    const data = await fetchSkillAll();
    return c.json(data);
  } catch (error) {
    return respondFetchError(c, '/api/skills', error);
  }
});

// お問い合わせ
app.post('/contact', async (c) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  const result = validateContact(body);
  if (!result.ok) {
    return c.json({ error: result.error }, 400);
  }
  const { name, email, subject, message } = result.value;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    const missing = Object.entries({
      RESEND_API_KEY: apiKey,
      RESEND_FROM_EMAIL: from,
      CONTACT_TO_EMAIL: to,
    })
      .filter(([, value]) => !value)
      .map(([name]) => name);
    console.error(`[contact] 環境変数が未設定です: ${missing.join(', ')}`);
    return c.json({ error: 'Server misconfiguration' }, 500);
  }

  // モジュール評価時に初期化すると、キー未設定の環境（Vercel Preview など）で
  // ビルドが失敗するため、リクエスト時に生成する
  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `【お問い合わせ】${subject}`,
      text: `お名前: ${name}\nメールアドレス: ${email}\n\n${message}`,
      replyTo: email,
    });
    if (error) {
      // Resend の message には入力値が含まれうるため、エラー種別のみ出力する
      console.error(`[contact] メール送信に失敗しました: ${error.name}`);
      return c.json({ error: 'Failed to send email' }, 500);
    }
  } catch (e) {
    const detail = e instanceof Error ? e.name : 'Unknown error';
    console.error(`[contact] メール送信中に例外が発生しました: ${detail}`);
    return c.json({ error: 'Failed to send email' }, 500);
  }

  return c.json({ success: true });
});

export type AppType = typeof app;
export const GET = handle(app);
export const POST = handle(app);
