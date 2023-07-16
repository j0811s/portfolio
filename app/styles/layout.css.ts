import { style, globalStyle } from "@vanilla-extract/css";

export const container = style({
  display: 'block',
  position: 'relative',
  '@media': {
    'screen and (max-width: 767px)': {
      padding: '30px 0',
    },
    'screen and (min-width: 768px)': {
      padding: '60px 0',
    }
  }
});