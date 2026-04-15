import { atom } from 'jotai';
import type { Theme } from '@/src/features/theme';

export const themeAtom = atom<Theme>('light');
