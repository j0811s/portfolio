import type { Theme } from "@/src/features/theme";
import { atom } from "jotai";

export const themeAtom = atom<Theme>('light');
