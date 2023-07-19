import { style } from "@vanilla-extract/css";

export const container = style({
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 767px)': {
      padding: '14px',
    },
    'screen and (min-width: 768px)': {
      maxWidth: 1280,
      padding: '0 20px',
    }
  }
});

export const wrapper = style({
  margin: '0 auto',
  '@media': {
    'screen and (min-width: 960px)': {
      display: 'flex',
      flexWrap: 'wrap',
      // flexDirection: 'row-reverse',
      justifyContent: 'space-between'
    }
  }
});