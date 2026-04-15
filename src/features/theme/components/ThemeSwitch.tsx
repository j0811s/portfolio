'use client';

import type { Theme } from '@/src/features/theme';
import styles from '@/src/features/theme/styles/ThemeSwitch.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useAtom } from 'jotai';
import { themeAtom } from '@/src/features/theme/stores/atoms';

export default function ThemeSwitch() {
  const [theme, setTheme] = useAtom<Theme>(themeAtom);

  return (
    <div className={`${styles.container} ${theme === 'light' ? styles.enabled : ''}`}>
      <button
        className={`${styles.button} ${theme === 'light' ? styles.light : styles.dark}`}
        type="button"
        aria-label="テーマカラーを変更する"
        onClick={(_e) => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        <FontAwesomeIcon
          className={`${styles.icon} ${theme === 'light' ? styles.light : styles.dark}`}
          icon={theme === 'light' ? faSun : faMoon}
        />
      </button>
    </div>
  );
}
