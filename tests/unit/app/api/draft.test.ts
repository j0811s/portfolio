// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { enable, set, draftMode, cookies } = vi.hoisted(() => {
  const enable = vi.fn();
  const set = vi.fn();
  const draftMode = vi.fn(async () => ({ enable, disable: vi.fn(), isEnabled: false }));
  const cookies = vi.fn(async () => ({ set, delete: vi.fn() }));
  return { enable, set, draftMode, cookies };
});

vi.mock('resend', () => ({ Resend: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('next/headers', () => ({ cookies, draftMode }));
vi.mock('@/src/app/api/auth/[...nextauth]/route', () => ({ authOptions: {} }));
vi.mock('@/src/libs/microcms/blog', () => ({ fetchBlogList: vi.fn(), fetchBlogDetail: vi.fn() }));
vi.mock('@/src/libs/microcms/skill', () => ({ fetchSkillAll: vi.fn() }));

/** クエリ文字列をそのまま連結して GET /api/draft を呼ぶ（エンコード済みの値も検証できるように） */
const getDraft = async (query: string) => {
  const { GET } = await import('@/src/app/api/[[...route]]/route');
  return GET(new Request(`http://localhost/api/draft?${query}`));
};

const expectDraftNotEnabled = () => {
  expect(enable).not.toHaveBeenCalled();
  expect(set).not.toHaveBeenCalled();
};

describe('GET /api/draft', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    'abc123def',
    'my-post_01',
    'A'.repeat(100),
  ])('正常な id (%s) ならドラフトモードを有効化して /blog/:id/preview/ にリダイレクトする', async (id) => {
    const res = await getDraft(`id=${id}&draftKey=Ab1-cD_2`);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe(`/blog/${id}/preview/`);
    expect(enable).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(
      'draft_key',
      'Ab1-cD_2',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/' })
    );
  });

  it('上限ちょうど（100文字）の draftKey を受け付ける', async () => {
    const draftKey = 'B'.repeat(100);
    const res = await getDraft(`id=abc&draftKey=${draftKey}`);

    expect(res.status).toBe(302);
    expect(set).toHaveBeenCalledWith('draft_key', draftKey, expect.any(Object));
  });

  it('id が重複していても、検証した値とリダイレクト先に使う値が一致する', async () => {
    const res = await getDraft('id=abc&id=..%2Fx&draftKey=abc');

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/blog/abc/preview/');
  });

  it.each([
    ['id が無い', 'draftKey=abc'],
    ['draftKey が無い', 'id=abc'],
    ['id が空文字', 'id=&draftKey=abc'],
    ['draftKey が空文字', 'id=abc&draftKey='],
  ])('%s なら 400 を返す', async (_, query) => {
    const res = await getDraft(query);

    expect(res.status).toBe(400);
    expect(await res.text()).toBe('id and draftKey are required');
    expectDraftNotEnabled();
  });

  it.each([
    ['スラッシュを含む', 'a/b'],
    ['パストラバーサル', '..'],
    ['パストラバーサル（区切り付き）', '../admin'],
    ['エンコードされたスラッシュ', 'a%2Fb'],
    ['エンコードされたドット', '%2E%2E'],
    ['二重エンコードされたスラッシュ', 'a%252Fb'],
    ['クエリ区切り', 'a%3Fx%3D1'],
    ['フラグメント', 'a%23b'],
    ['バックスラッシュ', 'a%5Cb'],
    ['空白', 'a%20b'],
    ['改行', 'a%0D%0Ab'],
    ['マルチバイト文字', '%E3%81%82'],
    ['上限超過（101文字）', 'a'.repeat(101)],
  ])('id が不正な形式（%s）なら 400 を返し、ドラフトモードを有効化しない', async (_, id) => {
    const res = await getDraft(`id=${id}&draftKey=abc`);

    expect(res.status).toBe(400);
    expect(await res.text()).toBe('invalid id or draftKey');
    expectDraftNotEnabled();
  });

  it.each([
    ['セミコロン', 'abc%3B%20Path%3D%2F'],
    ['スラッシュ', 'a%2Fb'],
    ['空白', 'a%20b'],
    ['上限超過（101文字）', 'a'.repeat(101)],
  ])('draftKey が不正な形式（%s）なら 400 を返し、Cookie をセットしない', async (_, draftKey) => {
    const res = await getDraft(`id=abc&draftKey=${draftKey}`);

    expect(res.status).toBe(400);
    expect(await res.text()).toBe('invalid id or draftKey');
    expectDraftNotEnabled();
  });
});
