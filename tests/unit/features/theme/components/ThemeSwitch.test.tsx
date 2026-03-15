import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createStore, Provider } from 'jotai';
import ThemeSwitch from '@/src/features/theme/components/ThemeSwitch';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: { iconName: string } }) => (
    <span data-icon={icon.iconName} />
  ),
}));

function renderWithStore() {
  const store = createStore();
  const result = render(
    <Provider store={store}>
      <ThemeSwitch />
    </Provider>
  );
  return result;
}

describe('ThemeSwitch', () => {
  it('初期状態 (light) で sun アイコンが表示される', () => {
    const { container } = renderWithStore();
    expect(container.querySelector('[data-icon="sun"]')).not.toBeNull();
    expect(container.querySelector('[data-icon="moon"]')).toBeNull();
  });

  it('ボタンの aria-label が設定されている', () => {
    renderWithStore();
    expect(screen.getByRole('button', { name: 'テーマカラーを変更する' })).toBeTruthy();
  });

  it('クリックするとダークテーマに切り替わり moon アイコンが表示される', () => {
    const { container } = renderWithStore();
    fireEvent.click(screen.getByRole('button'));
    expect(container.querySelector('[data-icon="moon"]')).not.toBeNull();
    expect(container.querySelector('[data-icon="sun"]')).toBeNull();
  });

  it('2回クリックするとライトテーマに戻り sun アイコンが表示される', () => {
    const { container } = renderWithStore();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    expect(container.querySelector('[data-icon="sun"]')).not.toBeNull();
  });
});
