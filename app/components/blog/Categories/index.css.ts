import { style, globalStyle } from "@vanilla-extract/css";

export const container = style({
  
});

export const list = style({
  margin: '0.5em 0 0'
});

export const listItem = style({
  fontSize: 14,
  fontWeight: 400,
  margin: '6px 0 0',
  paddingLeft: '1em',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 16,
    },
    'screen and (min-width: 960px)': {
      fontSize: 16,
    }
  }
});

export const listIetmLink = style({
  display: 'inline-block',
  borderBottom: '1px solid transparent',
  transition: 'border-bottom 0.2s linear',
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: '#000'
        }
      }
    }
  }
});