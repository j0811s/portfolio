import { cookies, draftMode } from 'next/headers';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route';
import { fetchBlogList, fetchBlogDetail } from '@/src/libs/microcms/blog';
import { fetchSkillAll } from '@/src/libs/microcms/skill';
import { buildSearchFilters } from '@/src/libs/blog/buildSearchFilters';
import { validateContact } from '@/src/libs/contact/validateContact';

const app = new Hono({ strict: false }).basePath('/api');

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
  const limit = c.req.query('limit');
  const offset = c.req.query('offset');
  try {
    const data = await fetchBlogList('blog', {
      filters: q ? buildSearchFilters(q) : undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      fields: 'id,title,eyecatch,publishedAt,updatedAt',
    });
    return c.json(data);
  } catch {
    return c.json({ error: 'Not found' }, 404);
  }
});

// ブログ詳細
app.get('/blog/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const data = await fetchBlogDetail('blog', id);
    return c.json(data);
  } catch {
    return c.json({ error: 'Not found' }, 404);
  }
});

// スキル一覧
app.get('/skills', async (c) => {
  try {
    const data = await fetchSkillAll();
    return c.json(data);
  } catch {
    return c.json({ error: 'Not found' }, 404);
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
