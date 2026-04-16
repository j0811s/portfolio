import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactForm from '@/src/features/contact/components/ContactForm';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const fillAllFields = () => {
  fireEvent.change(screen.getByLabelText('お名前'), { target: { value: '山田 太郎' } });
  fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('件名'), { target: { value: 'テスト件名' } });
  fireEvent.change(screen.getByLabelText('メッセージ'), { target: { value: 'テストメッセージ' } });
};

describe('ContactForm', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('全フィールドと送信ボタンが表示される', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText('お名前')).toBeTruthy();
    expect(screen.getByLabelText('メールアドレス')).toBeTruthy();
    expect(screen.getByLabelText('件名')).toBeTruthy();
    expect(screen.getByLabelText('メッセージ')).toBeTruthy();
    expect(screen.getByRole('button', { name: '送信する' })).toBeTruthy();
  });

  it('未入力で送信すると全フィールドに必須エラーが表示される', async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: '送信する' }));
    await waitFor(() => {
      expect(screen.getByText('お名前は必須です')).toBeTruthy();
      expect(screen.getByText('メールアドレスは必須です')).toBeTruthy();
      expect(screen.getByText('件名は必須です')).toBeTruthy();
      expect(screen.getByText('メッセージは必須です')).toBeTruthy();
    });
  });

  it('不正なメールアドレスで送信するとフォーマットエラーが表示される', async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: '送信する' }));
    await waitFor(() => {
      expect(screen.getByText('正しいメールアドレスを入力してください')).toBeTruthy();
    });
  });

  it('送信中はボタンが disabled になり「送信中...」と表示される', async () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<ContactForm />);
    fillAllFields();
    fireEvent.click(screen.getByRole('button', { name: '送信する' }));
    await waitFor(() => {
      const button = screen.getByRole('button', { name: '送信中...' }) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.disabled).toBe(true);
    });
  });

  it('送信成功で成功メッセージが表示されフォームが消える', async () => {
    mockFetch.mockResolvedValue({ ok: true });
    render(<ContactForm />);
    fillAllFields();
    fireEvent.click(screen.getByRole('button', { name: '送信する' }));
    await waitFor(() => {
      expect(screen.getByText('送信しました。お返事をお待ちください。')).toBeTruthy();
    });
    expect(screen.queryByRole('button', { name: '送信する' })).toBeNull();
  });

  it('送信失敗でエラーメッセージが表示されフォームは残る', async () => {
    mockFetch.mockResolvedValue({ ok: false });
    render(<ContactForm />);
    fillAllFields();
    fireEvent.click(screen.getByRole('button', { name: '送信する' }));
    await waitFor(() => {
      expect(screen.getByText('送信に失敗しました。時間をおいて再度お試しください。')).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: '送信する' })).toBeTruthy();
  });

  it('ネットワークエラーでもエラーメッセージが表示される', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    render(<ContactForm />);
    fillAllFields();
    fireEvent.click(screen.getByRole('button', { name: '送信する' }));
    await waitFor(() => {
      expect(screen.getByText('送信に失敗しました。時間をおいて再度お試しください。')).toBeTruthy();
    });
  });

  it('2000文字を超えるメッセージで送信するとエラーが表示される', async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText('メッセージ'), {
      target: { value: 'a'.repeat(2001) },
    });
    fireEvent.click(screen.getByRole('button', { name: '送信する' }));
    await waitFor(() => {
      expect(screen.getByText('2000文字以内で入力してください')).toBeTruthy();
    });
  });
});
