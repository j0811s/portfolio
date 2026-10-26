// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchBlogList } = vi.hoisted(() => ({
  fetchBlogList: vi.fn(async () => ({ contents: [], totalCount: 0, limit: 10, offset: 0 })),
}));

vi.mock('resend', () => ({ Resend: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), draftMode: vi.fn() }));
vi.mock('@/src/app/api/auth/[...nextauth]/route', () => ({ authOptions: {} }));
vi.mock('@/src/libs/microcms/blog', () => ({ fetchBlogList, fetchBlogDetail: vi.fn() }));
vi.mock('@/src/libs/microcms/skill', () => ({ fetchSkillAll: vi.fn() }));

const getBlogList = async (query: string) => {
  const { GET } = await import('@/src/app/api/[[...route]]/route');
  return GET(new Request(`http://localhost/api/blog?${query}`));
};

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
