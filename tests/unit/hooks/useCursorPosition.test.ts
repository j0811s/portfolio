import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useCursorPosition from '@/src/hooks/useCursorPosition';

describe('useCursorPosition', () => {
  it('初期状態は { x: 0, y: 0 }', () => {
    const { result } = renderHook(() => useCursorPosition());

    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it('pointermoveイベントで座標が更新される', () => {
    const { result } = renderHook(() => useCursorPosition());

    act(() => {
      const event = new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 200,
      });

      document.documentElement.dispatchEvent(event);
    });

    expect(result.current).toEqual({ x: 100, y: 200 });
  });

  it('アンマウント時にイベントリスナーが解除される', () => {
    const addSpy = vi.spyOn(document.documentElement, 'addEventListener');
    const removeSpy = vi.spyOn(document.documentElement, 'removeEventListener');

    const { unmount } = renderHook(() => useCursorPosition());

    expect(addSpy).toHaveBeenCalledWith(
      'pointermove',
      expect.any(Function)
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      'pointermove',
      expect.any(Function)
    );
  });
});
