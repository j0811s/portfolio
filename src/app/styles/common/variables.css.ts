import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    primary: '#000',
    secondary: '#F5F5F5',
    tertiary: '#9E9E9E',
    body: '#FAFAFA',
    error: '#B3261E',
    gray: {
      default: '#EEEEEE',
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