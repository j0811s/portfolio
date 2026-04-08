import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchForm from '@/src/features/blog/components/SearchForm';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('SearchForm', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('検索フォームが表示される', () => {
    render(<SearchForm />);
    expect(screen.getByRole('search')).toBeTruthy();
    expect(screen.getByPlaceholderText('キーワードで検索')).toBeTruthy();
    expect(screen.getByRole('button', { name: '検索' })).toBeTruthy();
  });

  it('defaultValue が未指定の場合はリセットボタンが表示されない', () => {
    render(<SearchForm />);
    expect(screen.queryByRole('button', { name: 'リセット' })).toBeNull();
  });

  it('defaultValue がある場合はリセットボタンが表示される', () => {
    render(<SearchForm defaultValue="Next.js" />);
    expect(screen.getByRole('button', { name: 'リセット' })).toBeTruthy();
  });

  it('入力するとリセットボタンが表示される', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Hono' },
    });
    expect(screen.getByRole('button', { name: 'リセット' })).toBeTruthy();
  });

  it('入力をクリアするとリセットボタンが消える', () => {
    render(<SearchForm />);
    const input = screen.getByPlaceholderText('キーワードで検索');
    fireEvent.change(input, { target: { value: 'Hono' } });
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.queryByRole('button', { name: 'リセット' })).toBeNull();
  });

  it('キーワードを入力して送信すると検索ページへ遷移する', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'Next.js' },
    });
    fireEvent.submit(screen.getByRole('search'));
    expect(mockPush).toHaveBeenCalledWith('/blog/search?q=Next.js');
  });

  it('空のまま送信してもルーターが呼ばれない', () => {
    render(<SearchForm />);
    fireEvent.submit(screen.getByRole('search'));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('スペースのみで送信してもルーターが呼ばれない', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: '   ' },
    });
    fireEvent.submit(screen.getByRole('search'));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('リセットボタンをクリックすると /blog/ へ遷移する', () => {
    render(<SearchForm defaultValue="Hono" />);
    fireEvent.click(screen.getByRole('button', { name: 'リセット' }));
    expect(mockPush).toHaveBeenCalledWith('/blog/');
  });

  it('特殊文字を含むキーワードはエンコードされて遷移する', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByPlaceholderText('キーワードで検索'), {
      target: { value: 'C++' },
    });
    fireEvent.submit(screen.getByRole('search'));
    expect(mockPush).toHaveBeenCalledWith('/blog/search?q=C%2B%2B');
  });
});
