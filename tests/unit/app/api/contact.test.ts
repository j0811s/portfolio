// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { send, ResendMock, getServerSession } = vi.hoisted(() => {
  const send = vi.fn();
  // 本物の Resend と同様に、API キーが無ければコンストラクタで例外を投げる
  const ResendMock = vi.fn(function (this: { emails: { send: typeof send } }, apiKey?: string) {
    if (!apiKey) throw new Error('Missing API key');
    this.emails = { send };
  });
  const getServerSession = vi.fn();
  return { send, ResendMock, getServerSession };
});

vi.mock('resend', () => ({ Resend: ResendMock }));
vi.mock('next-auth', () => ({ getServerSession }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), draftMode: vi.fn() }));
vi.mock('@/src/app/api/auth/[...nextauth]/route', () => ({ authOptions: {} }));
vi.mock('@/src/libs/microcms/blog', () => ({ fetchBlogList: vi.fn(), fetchBlogDetail: vi.fn() }));
vi.mock('@/src/libs/microcms/skill', () => ({ fetchSkillAll: vi.fn() }));

const postContact = async () => {
  const { POST } = await import('@/src/app/api/[[...route]]/route');
  return POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '山田', email: 'yamada@example.com', subject: '件名', message: '本文' }),
    }),
  );
};

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('RESEND_FROM_EMAIL', 'from@example.com');
    vi.stubEnv('CONTACT_TO_EMAIL', 'to@example.com');
    getServerSession.mockResolvedValue({ user: { name: 'test' } });
    send.mockResolvedValue({ error: null });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('RESEND_API_KEY が未設定でもモジュールを読み込める', async () => {
    vi.stubEnv('RESEND_API_KEY', undefined);
    await expect(import('@/src/app/api/[[...route]]/route')).resolves.toBeDefined();
  });

  it.each(['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'CONTACT_TO_EMAIL'])(
    '%s が未設定なら 500 を返し、Resend を初期化しない',
    async (name) => {
      vi.stubEnv(name, undefined);

      const res = await postContact();

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Server misconfiguration' });
      expect(ResendMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining(name));
    },
  );

  it('未認証なら環境変数が未設定でも 401 を返す', async () => {
    getServerSession.mockResolvedValue(null);
    vi.stubEnv('RESEND_API_KEY', undefined);

    const res = await postContact();

    expect(res.status).toBe(401);
    expect(ResendMock).not.toHaveBeenCalled();
  });

  it('環境変数が揃っていればメールを送信して成功を返す', async () => {
    const res = await postContact();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(ResendMock).toHaveBeenCalledWith('re_test');
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'from@example.com',
        to: 'to@example.com',
        subject: '【お問い合わせ】件名',
        replyTo: 'yamada@example.com',
      }),
    );
  });
});
