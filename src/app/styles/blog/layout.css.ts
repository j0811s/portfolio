import { style } from "@vanilla-extract/css";
import { vars } from "../common/variables.css";

export const container = style({
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 767px)': {
      padding: '16px',
    },
    'screen and (min-width: 768px)': {
      maxWidth: 1280,
      padding: '60px 16px 80px',
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