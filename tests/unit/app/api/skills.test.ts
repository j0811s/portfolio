// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMicroCMSError, createNotFoundError } from '../../helpers/microcms';

const { fetchSkillAll } = vi.hoisted(() => ({
  fetchSkillAll: vi.fn(async () => [{ id: 'skill-1' }]),
}));

vi.mock('resend', () => ({ Resend: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), draftMode: vi.fn() }));
vi.mock('@/src/app/api/auth/[...nextauth]/route', () => ({ authOptions: {} }));
vi.mock('@/src/libs/microcms/blog', () => ({ fetchBlogList: vi.fn(), fetchBlogDetail: vi.fn() }));
vi.mock('@/src/libs/microcms/skill', () => ({ fetchSkillAll }));

const getSkills = async () => {
  const { GET } = await import('@/src/app/api/[[...route]]/route');
  return GET(new Request('http://localhost/api/skills'));
};

describe('GET /api/skills', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('取得に成功したら 200 でスキル一覧を返す', async () => {
    const res = await getSkills();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 'skill-1' }]);
  });

  it('取得関数が notFound() を投げたら 404 を返し、ログは出さない', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchSkillAll.mockRejectedValueOnce(createNotFoundError());

    const res = await getSkills();

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Not found' });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('それ以外のエラーは 502 を返し、ログに出す', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchSkillAll.mockRejectedValueOnce(await createMicroCMSError({ status: 500 }));

    const res = await getSkills();

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'Failed to fetch' });
    expect(consoleError).toHaveBeenCalledWith(
      '[/api/skills] microCMS からの取得に失敗しました: fetch API response status: 500 message is `error`'
    );
  });
});
