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

const validBody = { name: '山田', email: 'yamada@example.com', subject: '件名', message: '本文' };

const postContact = async (body: unknown = validBody) => {
  const { POST } = await import('@/src/app/api/[[...route]]/route');
  return POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
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

  it.each([
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'CONTACT_TO_EMAIL',
  ])('%s が未設定なら 500 を返し、Resend を初期化しない', async (name) => {
    vi.stubEnv(name, undefined);

    const res = await postContact();

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Server misconfiguration' });
    expect(ResendMock).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(name));
  });

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
      })
    );
  });

  describe('入力バリデーション', () => {
    const expectRejected = async (body: unknown) => {
      const res = await postContact(body);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ error: expect.any(String) });
      expect(send).not.toHaveBeenCalled();
      return json as { error: string };
    };

    it('JSON として不正なボディは 400 を返す', async () => {
      await expectRejected('{not json');
    });

    it.each([
      ['null', null],
      ['配列', []],
      ['文字列', 'text'],
      ['数値', 1],
    ])('ボディがオブジェクトでない (%s) 場合は 400 を返す', async (_, body) => {
      await expectRejected(body);
    });

    it.each([
      'name',
      'email',
      'subject',
      'message',
    ])('%s が欠落していれば 400 を返す', async (field) => {
      const { [field as keyof typeof validBody]: _, ...rest } = validBody;
      await expectRejected(rest);
    });

    it.each([
      ['name', 123],
      ['email', null],
      ['subject', { text: '件名' }],
      ['message', ['本文']],
      ['name', true],
    ])('%s が文字列でない (%j) 場合は 400 を返す', async (field, value) => {
      await expectRejected({ ...validBody, [field]: value });
    });

    it.each([
      'name',
      'email',
      'subject',
      'message',
    ])('%s が空白のみなら 400 を返す', async (field) => {
      await expectRejected({ ...validBody, [field]: '   ' });
    });

    it.each([
      'yamada',
      'yamada@example',
      'ya mada@example.com',
      '@example.com',
      'yamada@@example.com',
      'a,b@example.com',
      '<a>@example.com',
    ])('不正なメール形式 (%s) は 400 を返す', async (email) => {
      await expectRejected({ ...validBody, email });
    });

    it.each([
      ['name', 101],
      ['email', 255],
      ['subject', 201],
      ['message', 2001],
    ])('%s が上限 (%i 文字) を超えると 400 を返す', async (field, length) => {
      const value =
        field === 'email'
          ? `${'a'.repeat(length - '@example.com'.length)}@example.com`
          : 'あ'.repeat(length);
      await expectRejected({ ...validBody, [field]: value });
    });

    it.each([
      ['name', 100],
      ['email', 254],
      ['subject', 200],
      ['message', 2000],
    ])('%s が上限ちょうど (%i 文字) なら送信する', async (field, length) => {
      const value =
        field === 'email'
          ? `${'a'.repeat(length - '@example.com'.length)}@example.com`
          : 'あ'.repeat(length);
      const res = await postContact({ ...validBody, [field]: value });

      expect(res.status).toBe(200);
      expect(send).toHaveBeenCalledTimes(1);
    });

    it('message の改行は許可する', async () => {
      const res = await postContact({ ...validBody, message: '1行目\n2行目' });

      expect(res.status).toBe(200);
      expect(send).toHaveBeenCalledTimes(1);
    });

    it.each([
      ['name', '山田\n太郎'],
      ['subject', '件名\r\nBcc: evil@example.com'],
      ['subject', '件名\u2028次行'],
    ])('%s に改行が含まれると 400 を返す', async (field, value) => {
      await expectRejected({ ...validBody, [field]: value });
    });

    it('エラーレスポンスに入力値を含めない', async () => {
      const marker = 'LEAK_MARKER_<script>';
      const json = await expectRejected({ ...validBody, email: marker });

      expect(JSON.stringify(json)).not.toContain(marker);
    });

    it('未認証ならバリデーションより先に 401 を返す', async () => {
      getServerSession.mockResolvedValue(null);

      const res = await postContact({});

      expect(res.status).toBe(401);
    });
  });

  describe('Resend 送信エラー', () => {
    it('send の戻り値に error があれば 500 を返し、ログを出力する', async () => {
      send.mockResolvedValue({
        data: null,
        error: { name: 'validation_error', message: 'Invalid from' },
      });

      const res = await postContact();

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Failed to send email' });
      expect(console.error).toHaveBeenCalled();
    });

    it('send が reject したら 500 の JSON を返し、ログを出力する', async () => {
      send.mockRejectedValue(new Error('network down'));

      const res = await postContact();

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Failed to send email' });
      expect(console.error).toHaveBeenCalled();
    });

    it.each([
      [
        'reject',
        () => send.mockRejectedValue(new Error('Invalid reply_to: yamada@example.com re_test')),
      ],
      [
        '戻り値 error',
        () =>
          send.mockResolvedValue({
            data: null,
            error: {
              name: 'validation_error',
              message: 'Invalid reply_to: yamada@example.com re_test',
            },
          }),
      ],
    ])('%s のエラーログに API キーやユーザー入力を含めない', async (_, setup) => {
      setup();
      const message = 'SECRET_MESSAGE_BODY';

      await postContact({ ...validBody, message });

      expect(console.error).toHaveBeenCalled();

      const logged = JSON.stringify(vi.mocked(console.error).mock.calls, (_, v) =>
        v instanceof Error ? { name: v.name, message: v.message, stack: v.stack } : v
      );
      expect(logged).not.toContain('re_test');
      expect(logged).not.toContain(message);
      expect(logged).not.toContain('yamada@example.com');
    });
  });
});
