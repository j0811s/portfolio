import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Logo from '@/src/features/header/components/Logo';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('Logo', () => {
  it('デフォルトで div タグでレンダリングされる', () => {
    const { container } = render(<Logo />);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('as="h1" で h1 タグでレンダリングされる', () => {
    const { container } = render(<Logo as="h1" />);
    expect(container.firstChild?.nodeName).toBe('H1');
  });

  it('link=true (デフォルト) でリンクが表示される', () => {
    render(<Logo />);
    const link = screen.getByRole('link', { name: 'Portfolio Site' });
    expect(link.getAttribute('href')).toBe('/');
  });

  it('link=false でリンクが表示されず span になる', () => {
    render(<Logo link={false} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Portfolio Site').tagName).toBe('SPAN');
  });
});
