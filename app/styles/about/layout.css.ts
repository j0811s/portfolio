import { style } from "@vanilla-extract/css";

export const container = style({
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 959px)': {
      padding: '14px',
    },
    'screen and (min-width: 960px)': {
      maxWidth: 1280,
      padding: '0 20px',
    }
  }
});

export const wrapper = style({
  margin: '0 auto',
  '@media': {
    'screen and (min-width: 960px)': {
    }
  }
});