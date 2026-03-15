import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore, Provider } from 'jotai';
import DrawerMenu from '@/src/features/header/components/DrawerMenu';
import { isDrawerOpenAtom } from '@/src/features/header/stores/atoms';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

vi.mock('@/src/features/header/components/GithubLink', () => ({
  GithubLink: () => <a href="https://github.com">GitHub</a>,
}));

vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
  HTMLDialogElement.prototype.getAnimations = vi.fn(() => []);
});

describe('DrawerMenu', () => {
  it('isDrawerOpenAtom が false の場合は何も表示しない', () => {
    const { container } = render(
      <DrawerMenu>
        <button>閉じる</button>
      </DrawerMenu>
    );
    expect(container.firstChild).toBeNull();
  });

  it('isDrawerOpenAtom が true の場合はナビゲーションが表示される', () => {
    const store = createStore();
    store.set(isDrawerOpenAtom, true);

    const { container } = render(
      <Provider store={store}>
        <DrawerMenu>
          <button>閉じる</button>
        </DrawerMenu>
      </Provider>
    );

    expect(container.querySelector('nav[aria-label="サイトナビゲーションメニュー"]')).not.toBeNull();
  });

  it('ドロワーが開いているとき子要素が表示される', () => {
    const store = createStore();
    store.set(isDrawerOpenAtom, true);

    render(
      <Provider store={store}>
        <DrawerMenu>
          <button>閉じるボタン</button>
        </DrawerMenu>
      </Provider>
    );

    expect(screen.getByText('閉じるボタン')).toBeTruthy();
  });

  it('ドロワーが開いているときナビリンクが表示される', () => {
    const store = createStore();
    store.set(isDrawerOpenAtom, true);

    const { container } = render(
      <Provider store={store}>
        <DrawerMenu>
          <span />
        </DrawerMenu>
      </Provider>
    );

    const topLink = container.querySelector('a[href="/"]');
    const blogLink = container.querySelector('a[href="/blog/"]');
    expect(topLink).not.toBeNull();
    expect(blogLink).not.toBeNull();
  });
});
