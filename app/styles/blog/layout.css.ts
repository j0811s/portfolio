import { style } from "@vanilla-extract/css";

export const blogLayoutContainer = style({
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 767px)': {
      padding: '14px',
    },
    'screen and (min-width: 768px)': {
      maxWidth: 1280,
      padding: '0 20px',
    },
    'screen and (min-width: 960px)': {
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between'
    }
  }
});