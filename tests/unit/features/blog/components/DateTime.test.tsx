import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DateTime from '@/src/features/blog/components/DateTime';

describe('DateTime', () => {
  it('date が空文字の場合は何も表示しない', () => {
    const { container } = render(<DateTime date="" />);
    expect(container.querySelector('time')).toBeNull();
  });

  it('デフォルトフォーマット YYYY/MM/DD で日付を表示する', () => {
    render(<DateTime date="2024-01-15" />);
    const time = screen.getByText('2024/01/15');
    expect(time.tagName).toBe('TIME');
    expect(time.getAttribute('dateTime')).toBe('2024-01-15');
  });

  it('カスタムフォーマットで日付を表示する', () => {
    render(<DateTime date="2024-01-15" format="YYYY年MM月DD日" />);
    expect(screen.getByText('2024年01月15日')).toBeTruthy();
  });

  it('dateTime 属性に元の日付文字列が設定される', () => {
    render(<DateTime date="2024-12-31T10:00:00.000Z" />);
    const time = screen.getByText('2024/12/31');
    expect(time.getAttribute('dateTime')).toBe('2024-12-31T10:00:00.000Z');
  });
});
