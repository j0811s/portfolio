import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    primary: '#1a1f1e',
    secondary: '#1e2626',
    tertiary: '#323A3A',
    accent: {
      dark: '#348369',
      light: '#cddbb5',
    },
    text: {
      black: '#000',
      white: '#fff',
      gray: '#A9AAAA'
    },
    white: '#fff',
    body: '#FAFAFA',
    error: '#B3261E',
    gray: {
      taupe: '#85878F',
      default: '#EEEEEE',
      dark: '#78909C',
      bg: '#f0f2f5',
      hoverBg: '#d8dadd',
      text: '#495057',
      border: '#E0E0E0',
    },
    link: '#6997E4',
  },
  font: {
    size: '16' // fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
  }
});