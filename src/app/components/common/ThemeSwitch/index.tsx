'use client';

import { container, button, icon, enabled, disabled } from './index.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, Suspense } from 'react'
import { useTheme } from 'next-themes'


export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${container} ${enabled}`}>
        <div className={`${button} ${enabled}`}>
          <FontAwesomeIcon className={`${icon} ${enabled}`} icon={faSun} />
          <FontAwesomeIcon className={`${icon} ${disabled}`} icon={faMoon} />
        </div>
      </div>
    )
  }

  return (
    <div className={`${container} ${theme === 'light' ? enabled : ''}`}>
      <button className={`${button} ${theme === 'light' ? enabled : ''}`} type="button" aria-label="テーマカラーを変更する" onClick={e => setTheme(theme === 'light' ? 'dark' : 'light')}>
        <FontAwesomeIcon className={`${icon} ${theme === 'light' ? enabled : disabled}`} icon={faSun} />
        <FontAwesomeIcon className={`${icon} ${theme === 'dark' ? enabled : disabled}`} icon={faMoon} />
      </button>
    </div>
  )
}