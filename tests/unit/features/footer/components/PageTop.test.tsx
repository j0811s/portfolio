import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

const mockScrollToTop = vi.fn();

vi.mock('@/src/features/footer/hooks/useScrollThreshold', () => ({
  useScrollThreshold: vi.fn(() => false),
}));

vi.mock('@/src/features/footer/hooks/usePageTop', () => ({
  usePageTop: vi.fn(() => ({ scrollToTop: mockScrollToTop })),
}));

describe('PageTop', () => {
  beforeEach(() => {
    vi.resetModules();
    mockScrollToTop.mockReset();
  });

  it('ページトップボタンが表示される', async () => {
    const { default: PageTop } = await import('@/src/features/footer/components/PageTop');
    render(<PageTop />);
    expect(screen.getByRole('button', { name: 'ページトップへ戻る' })).toBeTruthy();
  });

  it('スクロール閾値に達していない場合は add-show クラスが付かない', async () => {
    const { useScrollThreshold } = await import('@/src/features/footer/hooks/useScrollThreshold');
    vi.mocked(useScrollThreshold).mockReturnValue(false);

    const { default: PageTop } = await import('@/src/features/footer/components/PageTop');
    render(<PageTop />);
    const button = screen.getByRole('button');
    expect(button.className).not.toContain('add-show');
  });

  it('スクロール閾値を超えた場合は add-show クラスが付く', async () => {
    const { useScrollThreshold } = await import('@/src/features/footer/hooks/useScrollThreshold');
    vi.mocked(useScrollThreshold).mockReturnValue(true);

    const { default: PageTop } = await import('@/src/features/footer/components/PageTop');
    render(<PageTop />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('add-show');
  });

  it('クリック時に scrollToTop が呼ばれる', async () => {
    const { default: PageTop } = await import('@/src/features/footer/components/PageTop');
    render(<PageTop />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);
  });
});
