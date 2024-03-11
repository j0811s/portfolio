"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { FC } from "react";

import { container } from '@/src/app/styles/layout.css';

export const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  return (
    <NextThemesProvider {...props}>
      {props.children}
    </NextThemesProvider>
  )
}