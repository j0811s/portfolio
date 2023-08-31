import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    primary: '#00BFA5',
    secondary: '#009688',
    tertiary: '#80CBC4',
    error: '#B3261E',
    gray: {
      default: '#f6f7f9',
      dark: '#78909C',
      bg: '#f0f2f5',
      hoverBg: '#d8dadd',
      text: '#495057',
      border: '#E0E0E0',
    },
    link: '#0969da',
  },
  font: {
    size: '16' // fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
  }
});