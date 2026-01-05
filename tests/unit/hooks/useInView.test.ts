import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useInView from '@/src/hooks/useInView';

let observerCallback: IntersectionObserverCallback;

beforeEach(() => {
  observerCallback = undefined as any;

  class MockIntersectionObserver {
    constructor(cb: IntersectionObserverCallback) {
      observerCallback = cb;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

describe('useInView', () => {
  it('初期状態はisVisibleがfalseになる', () => {
    const ref = { current: document.createElement('div') };

    const { result } = renderHook(() =>
      useInView({ ref })
    );

    expect(result.current).toBe(false);
  });

  it('要素が表示されたらisVisibleがtrueになる', () => {
    const ref = { current: document.createElement('div') };

    const { result } = renderHook(() =>
      useInView({ ref })
    );

    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
            target: ref.current!,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(result.current).toBe(true);
  });

  it('once=trueの場合、isVisibleがtrueになる', () => {
    const ref = { current: document.createElement('div') };

    const { result } = renderHook(() =>
      useInView({ ref, once: true })
    );

    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
            target: ref.current!,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(result.current).toBe(true);
  });
});
