import { style, globalStyle } from "@vanilla-extract/css";

export const container = style({
  
});

export const list = style({
  margin: '0.5em 0 0'
});

export const listIetm = style({
  border: '1px solid #000',
  borderRadius: 1000,
  display: 'inline-block',
  margin: '0 0.25em 0.25em 0',
  '@media': {
    'screen and (max-width: 767px)': {
      fontSize: 12,
    },
    'screen and (min-width: 768px)': {
      fontSize: 14,
    }
  }
});

export const listIetmLink = style({
  display: 'block',
  padding: '0.1em 0.6em 0.2em',
  borderRadius: 'inherit',
  color: '#000',
  backgroundColor: '#fff',
  transition: 'background-color 0.2s linear, color 0.2s linear',
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          color: '#fff',
          backgroundColor: '#000',
        }
      }
    }
  }
});
