import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
    error: '#B3261E',
    gray: {
      normal: '#eee',
      dark: '#79747E'
    },
    link: '#0969da'
  }
});