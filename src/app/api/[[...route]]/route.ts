import { cookies, draftMode } from 'next/headers';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route';
import { fetchBlogList, fetchBlogDetail } from '@/src/libs/microcms/blog';
import { fetchSkillAll } from '@/src/libs/microcms/skill';

const app = new Hono().basePath('/api');
const resend = new Resend(process.env.RESEND_API_KEY);

// プレビュー用
app.get('/draft', async (c) => {
  const id = c.req.query('id');
  const draftKey = c.req.query('draftKey');

  if (!id || !draftKey) {
    return c.text('id and draftKey are required', 400);
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
  try {
    const data = await fetchBlogList();
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

  let body: { name: string; email: string; subject: string; message: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  const { name, email, subject, message } = body;

  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    return c.json({ error: 'All fields are required' }, 400);
  }

  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!from || !to) {
    return c.json({ error: 'Server misconfiguration' }, 500);
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `【お問い合わせ】${subject}`,
    text: `お名前: ${name}\nメールアドレス: ${email}\n\n${message}`,
    replyTo: email,
  });

  if (error) {
    return c.json({ error: 'Failed to send email' }, 500);
  }

  return c.json({ success: true });
});

export type AppType = typeof app;
export const GET = handle(app);
export const POST = handle(app);
