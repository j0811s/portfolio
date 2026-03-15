import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CtaActionButton from '@/src/components/ui/CtaActionButton';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: { iconName: string } }) => (
    <span data-icon={icon.iconName} />
  ),
}));

describe('CtaActionButton', () => {
  it('子要素が表示される', () => {
    render(<CtaActionButton>送信</CtaActionButton>);
    expect(screen.getByRole('button', { name: '送信' })).toBeTruthy();
  });

  it('アイコンなしの場合はアイコンが表示されない', () => {
    const { container } = render(<CtaActionButton>テキスト</CtaActionButton>);
    expect(container.querySelector('[data-icon]')).toBeNull();
  });

  it('prevIcon=true で左矢印アイコンが表示される', () => {
    const { container } = render(<CtaActionButton prevIcon>戻る</CtaActionButton>);
    expect(container.querySelector('[data-icon="arrow-left-long"]')).not.toBeNull();
  });

  it('nextIcon=true で右矢印アイコンが表示される', () => {
    const { container } = render(<CtaActionButton nextIcon>次へ</CtaActionButton>);
    expect(container.querySelector('[data-icon="arrow-right-long"]')).not.toBeNull();
  });

  it('crossIcon=true で X アイコンが表示される', () => {
    const { container } = render(<CtaActionButton crossIcon>閉じる</CtaActionButton>);
    expect(container.querySelector('[data-icon="xmark"]')).not.toBeNull();
  });

  it('prevIcon と nextIcon が両方 true の場合はどちらのアイコンも表示されない', () => {
    const { container } = render(<CtaActionButton prevIcon nextIcon>両方</CtaActionButton>);
    expect(container.querySelector('[data-icon="arrow-left-long"]')).toBeNull();
    expect(container.querySelector('[data-icon="arrow-right-long"]')).toBeNull();
  });

  it('onClick が呼ばれる', () => {
    const handleClick = vi.fn();
    render(<CtaActionButton onClick={handleClick}>クリック</CtaActionButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
