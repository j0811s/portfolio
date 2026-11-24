// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMicroCMSError, createNotFoundError } from '../../helpers/microcms';

const { fetchBlogList, fetchBlogDetail } = vi.hoisted(() => ({
  fetchBlogList: vi.fn(async () => ({ contents: [], totalCount: 0, limit: 10, offset: 0 })),
  fetchBlogDetail: vi.fn(async () => ({ id: 'post-1', title: 'title' })),
}));

vi.mock('resend', () => ({ Resend: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), draftMode: vi.fn() }));
vi.mock('@/src/app/api/auth/[...nextauth]/route', () => ({ authOptions: {} }));
vi.mock('@/src/libs/microcms/blog', () => ({ fetchBlogList, fetchBlogDetail }));
vi.mock('@/src/libs/microcms/skill', () => ({ fetchSkillAll: vi.fn() }));

const get = async (path: string) => {
  const { GET } = await import('@/src/app/api/[[...route]]/route');
  return GET(new Request(`http://localhost${path}`));
};

const getBlogList = (query: string) => get(`/api/blog?${query}`);


describe('GET /api/blog', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('q を語ごとの AND 条件の filters に変換し、q 自体は渡さない', async () => {
    const res = await getBlogList('q=Next%20React');

    expect(res.status).toBe(200);
    expect(fetchBlogList).toHaveBeenCalledWith(
      'blog',
      expect.objectContaining({
        filters:
          '(title[contains]Next[or]content[contains]Next)[and](title[contains]React[or]content[contains]React)',
      })
    );
    expect(fetchBlogList).toHaveBeenCalledWith(
      'blog',
      expect.not.objectContaining({ q: expect.anything() })
    );
  });

  it.each(['', 'q=', 'q=%5B%5D()'])('有効な検索語が無い場合 (%s) は絞り込まない', async (query) => {
    await getBlogList(query);

    expect(fetchBlogList).toHaveBeenCalledWith(
      'blog',
      expect.objectContaining({ filters: undefined })
    );
  });
});

describe.each([
  { path: '/api/blog', endpoint: '/api/blog', mock: fetchBlogList },
  { path: '/api/blog/post-1', endpoint: '/api/blog/:id', mock: fetchBlogDetail },
])('$path の取得失敗', ({ path, endpoint, mock }) => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('取得に成功したら 200 で返す', async () => {
    const res = await get(path);

    expect(res.status).toBe(200);
  });

  it('取得関数が notFound() を投げたら（microCMS の 400 / 404）404 を返し、ログは出さない', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mock.mockRejectedValueOnce(createNotFoundError());

    const res = await get(path);

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Not found' });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('それ以外のエラー（microCMS の障害など）は 502 を返し、エンドポイントとエラーをログに出す', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mock.mockRejectedValueOnce(await createMicroCMSError({ status: 503 }));

    const res = await get(path);

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'Failed to fetch' });
    expect(consoleError).toHaveBeenCalledWith(
      `[${endpoint}] microCMS からの取得に失敗しました: fetch API response status: 503 message is \`error\``
    );
  });
});

describe('/api/blog のログ', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('検索語をログに含めない', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    // SDK のエラーはリクエスト URL（検索語を含む filters）を url プロパティに持っている
    fetchBlogList.mockRejectedValueOnce(
      await createMicroCMSError({ status: 503 }, { filters: 'title[contains]secret-keyword' })
    );

    await getBlogList('q=secret-keyword');

    expect(consoleError).toHaveBeenCalledOnce();
    expect(String(consoleError.mock.calls[0]?.[0])).not.toContain('secret-keyword');
  });
});
