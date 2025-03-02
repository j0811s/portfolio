"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;
import { FC } from "react";

export const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  return (
    <NextThemesProvider {...props}>
      {props.children}
    </NextThemesProvider>
  )
}