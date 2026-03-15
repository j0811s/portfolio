import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CtaLinkButton from '@/src/components/ui/CtaLinkButton';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: { iconName: string } }) => (
    <span data-icon={icon.iconName} />
  ),
}));

describe('CtaLinkButton', () => {
  it('asLink=true (デフォルト) でリンクとして表示される', () => {
    render(<CtaLinkButton href="/about">詳細</CtaLinkButton>);
    const link = screen.getByRole('link', { name: '詳細' });
    expect(link.getAttribute('href')).toBe('/about');
  });

  it('asLink=false で div として表示される', () => {
    render(<CtaLinkButton href="/about" asLink={false}>詳細</CtaLinkButton>);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('詳細').tagName).toBe('DIV');
  });

  it('prevIcon=true で左矢印アイコンが表示される', () => {
    const { container } = render(<CtaLinkButton href="/" prevIcon>戻る</CtaLinkButton>);
    expect(container.querySelector('[data-icon="arrow-left-long"]')).not.toBeNull();
  });

  it('nextIcon=true で右矢印アイコンが表示される', () => {
    const { container } = render(<CtaLinkButton href="/" nextIcon>次へ</CtaLinkButton>);
    expect(container.querySelector('[data-icon="arrow-right-long"]')).not.toBeNull();
  });

  it('prevIcon と nextIcon が両方 true の場合はどちらのアイコンも表示されない', () => {
    const { container } = render(<CtaLinkButton href="/" prevIcon nextIcon>両方</CtaLinkButton>);
    expect(container.querySelector('[data-icon="arrow-left-long"]')).toBeNull();
    expect(container.querySelector('[data-icon="arrow-right-long"]')).toBeNull();
  });
});
