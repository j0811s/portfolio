import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginError from '@/src/app/(login)/error';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span />,
}));

/** Server Component から転送されるエラーと同じく digest を持つ Error を作る */
const withDigest = (digest: string) => Object.assign(new Error('An error occurred'), { digest });

describe('(login)/error', () => {
  it('見出しと再試行・トップページへのボタンが表示される', () => {
    render(<LoginError error={new Error('x')} retry={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'ページを表示できませんでした' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '再試行' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'トップページへ' }).getAttribute('href')).toBe('/');
  });

  it('再試行を押すと retry が呼ばれる', () => {
    const retry = vi.fn();
    render(<LoginError error={new Error('x')} retry={retry} />);

    fireEvent.click(screen.getByRole('button', { name: '再試行' }));

    expect(retry).toHaveBeenCalledOnce();
  });

  it('digest があればエラー ID として表示する', () => {
    render(<LoginError error={withDigest('1234567890')} retry={vi.fn()} />);

    expect(screen.getByText('エラー ID: 1234567890')).toBeTruthy();
  });

  it('エラーメッセージは表示せず、digest が無ければエラー ID も表示しない', () => {
    render(<LoginError error={new Error('secret detail')} retry={vi.fn()} />);

    expect(screen.queryByText(/secret detail/)).toBeNull();
    expect(screen.queryByText(/エラー ID/)).toBeNull();
  });

  it('タブ名をエラーとして伝える', () => {
    render(<LoginError error={new Error('x')} retry={vi.fn()} />);

    expect(document.title).toMatch(/^エラー \| /);
  });

  it('Error 以外の値が投げられても表示できる', () => {
    render(<LoginError error="not an error" retry={vi.fn()} />);

    expect(screen.getByRole('button', { name: '再試行' })).toBeTruthy();
    expect(screen.queryByText(/エラー ID/)).toBeNull();
  });
});
