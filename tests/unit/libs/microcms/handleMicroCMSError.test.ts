// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleMicroCMSError } from '@/src/libs/microcms/handleMicroCMSError';
import { createMicroCMSError } from '../../helpers/microcms';

const { notFound, NOT_FOUND } = vi.hoisted(() => {
  const NOT_FOUND = new Error('notFound called');
  return {
    NOT_FOUND,
    notFound: vi.fn(() => {
      throw NOT_FOUND;
    }),
  };
});

// unstable_rethrow は本物を使い、notFound だけ呼び出しを検証できるよう差し替える
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  notFound,
}));

const createMicroCMSErrorWithStatus = (status: number) => createMicroCMSError({ status });
const createNetworkError = () => createMicroCMSError('network-error');

/** handleMicroCMSError が投げた値を返す（同じオブジェクトが投げ直されたかを toBe で確かめるため） */
const caughtFrom = (error: unknown): unknown => {
  try {
    handleMicroCMSError(error);
  } catch (caught) {
    return caught;
  }
  throw new Error('handleMicroCMSError が例外を投げなかった');
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  notFound.mockClear();
});

describe('handleMicroCMSError', () => {
  it.each([400, 404])('microCMS が %i を返したら notFound() を呼ぶ', async (status) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = await createMicroCMSErrorWithStatus(status);

    expect(caughtFrom(error)).toBe(NOT_FOUND);
    expect(notFound).toHaveBeenCalledOnce();
  });

  it('400 のときはリクエスト先をパスとパラメータ名だけで警告ログに出し、404 のときは出さない', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    caughtFrom(await createMicroCMSErrorWithStatus(404));
    expect(warn).not.toHaveBeenCalled();

    caughtFrom(
      await createMicroCMSError({ status: 400 }, { filters: 'title[contains]secret-keyword', limit: '10' })
    );
    expect(warn).toHaveBeenCalledWith('microCMS returned 400: /api/v1/blog?filters,limit');
    expect(String(warn.mock.calls[0]?.[0])).not.toContain('secret-keyword');
  });

  it.each([401, 403, 429, 500, 502, 503])(
    'microCMS が %i を返したら notFound() を呼ばずにそのまま投げ直す',
    async (status) => {
      const error = await createMicroCMSErrorWithStatus(status);

      expect(caughtFrom(error)).toBe(error);
      expect(notFound).not.toHaveBeenCalled();
    }
  );

  it('ネットワークエラーは notFound() を呼ばずにそのまま投げ直す', async () => {
    const error = await createNetworkError();

    expect(caughtFrom(error)).toBe(error);
    expect(notFound).not.toHaveBeenCalled();
  });

  it('microCMS 以外のエラーは notFound() を呼ばずにそのまま投げ直す', () => {
    const error = new Error('unexpected');

    expect(caughtFrom(error)).toBe(error);
    expect(notFound).not.toHaveBeenCalled();
  });

  it('Next.js 内部の例外（本物の notFound() が投げるもの）はそのまま投げ直す', async () => {
    const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');
    let nextError: unknown;
    try {
      actual.notFound();
    } catch (error) {
      nextError = error;
    }

    expect(caughtFrom(nextError)).toBe(nextError);
    expect(notFound).not.toHaveBeenCalled();
  });
});
