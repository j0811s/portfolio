import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
    error: '#B3261E',
    gray: {
      default: '#f6f7f9',
      dark: '#79747E',
      bg: '#f0f2f5',
      hoverBg: '#d8dadd',
      text: '#495057',
    },
    link: '#0969da',
  },
  font: {
    size: '16' // fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
  }
});