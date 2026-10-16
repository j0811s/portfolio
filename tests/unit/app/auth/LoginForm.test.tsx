import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signIn } from 'next-auth/react';
import LoginForm from '@/src/app/(logout)/auth/LoginForm';

const replace = vi.fn();

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

const submit = () => {
  fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'user' } });
  fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'pass' } });
  fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.mocked(signIn).mockReset();
    replace.mockReset();
  });

  it('認証に成功するとコールバック先へ遷移する', async () => {
    vi.mocked(signIn).mockResolvedValue({ ok: true, error: null, status: 200, url: 'http://localhost/' });
    render(<LoginForm />);

    submit();

    await waitFor(() => expect(replace).toHaveBeenCalledWith('http://localhost/'));
  });

  it('認証に失敗するとエラーメッセージを表示する', async () => {
    vi.mocked(signIn).mockResolvedValue({
      ok: false,
      error: 'CredentialsSignin',
      status: 401,
      url: null,
    });
    render(<LoginForm />);

    submit();

    expect(await screen.findByText('IDまたはパスワードが間違っています')).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();
  });

  // NextAuth は CSRF 検証に失敗すると error なし・ok: true で signin?csrf=true を返すため、明示的に失敗扱いにする
  it('CSRF 検証に失敗した応答は遷移せずエラーメッセージを表示する', async () => {
    vi.mocked(signIn).mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: 'http://localhost/api/auth/signin?csrf=true',
    });
    render(<LoginForm />);

    submit();

    expect(await screen.findByText('ログインに失敗しました。もう一度お試しください')).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();
  });

  it('signIn が例外を投げたらエラーメッセージを表示し、再送信できる状態に戻す', async () => {
    vi.mocked(signIn).mockRejectedValue(new TypeError('Failed to fetch'));
    render(<LoginForm />);

    submit();

    expect(await screen.findByText('ログインに失敗しました。もう一度お試しください')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'ログイン' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('認証に成功したら遷移完了まで再送信できない', async () => {
    vi.mocked(signIn).mockResolvedValue({ ok: true, error: null, status: 200, url: 'http://localhost/' });
    render(<LoginForm />);

    submit();

    await waitFor(() => expect(replace).toHaveBeenCalled());
    expect((screen.getByRole('button', { name: 'ログイン' }) as HTMLButtonElement).disabled).toBe(true);
  });

  // 並行して signIn すると CSRF Cookie が複数発行されて検証に失敗するため、送信中は再送信させない
  it('送信中はボタンを押せず、signIn を重複して呼ばない', async () => {
    let resolve: (value: Awaited<ReturnType<typeof signIn>>) => void = () => {};
    vi.mocked(signIn).mockReturnValue(new Promise((r) => (resolve = r)));
    render(<LoginForm />);

    submit();
    const button = screen.getByRole('button', { name: 'ログイン' }) as HTMLButtonElement;
    await waitFor(() => expect(button.disabled).toBe(true));
    fireEvent.click(button);

    expect(signIn).toHaveBeenCalledTimes(1);
    resolve({ ok: false, error: 'CredentialsSignin', status: 401, url: null });
    await waitFor(() => expect(button.disabled).toBe(false));
  });
});
