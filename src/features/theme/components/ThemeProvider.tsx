"use client";

import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { themeAtom } from "@/src/features/theme/stores/atoms";

export default function ThemeProvider() {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "light") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const themeColor = prefersDark ? "dark" : "light";
      root.dataset.theme = themeColor;
      setTheme(themeColor);
    } else {
      root.dataset.theme = theme;
    }

    return () => {
      root.dataset.theme = '';
    }
  }, [theme, setTheme]);

  return <></>;
}
