'use client';

import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { themeAtom } from '@/src/features/theme/stores/atoms';
import type { Theme } from '@/src/features/theme';

const COOKIE_KEY = 'theme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export default function ThemeProvider() {
  const [theme, setTheme] = useAtom(themeAtom);
  const initialized = useRef(false);

  // 先に定義: theme が変化したときに DOM と cookie を同期（初回マウントはスキップ）
  useEffect(() => {
    if (!initialized.current) return;
    document.documentElement.dataset.theme = theme;
    // biome-ignore lint/suspicious/noDocumentCookie: テーマ永続化のための意図的なcookie操作
    document.cookie = `${COOKIE_KEY}=${theme};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
  }, [theme]);

  // 後に定義: マウント時に cookie / システム設定から初期テーマを確定
  useEffect(() => {
    const cookieTheme = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${COOKIE_KEY}=`))
      ?.split('=')[1] as Theme | undefined;

    if (cookieTheme === 'light' || cookieTheme === 'dark') {
      setTheme(cookieTheme);
    } else {
      const initial: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      document.documentElement.dataset.theme = initial;
      // biome-ignore lint/suspicious/noDocumentCookie: テーマ永続化のための意図的なcookie操作
      document.cookie = `${COOKIE_KEY}=${initial};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
      setTheme(initial);
    }
    initialized.current = true;
  }, [setTheme]);

  return null;
}
