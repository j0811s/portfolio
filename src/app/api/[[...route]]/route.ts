import { cookies, draftMode } from 'next/headers';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { fetchBlogList, fetchBlogDetail } from '@/src/libs/microcms/blog';
import { fetchSkillAll } from '@/src/libs/microcms/skill';

const app = new Hono().basePath('/api');

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

export type AppType = typeof app;
export const GET = handle(app);
export const POST = handle(app);
