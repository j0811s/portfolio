import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const data = style({
  position: 'relative',
  zIndex: 3,
  paddingLeft: 'calc(1.5em - 20px)',
  '@media': {
    'screen and (min-width: 960px)': {
      maxWidth: 960
    }
  }
});

export const section = style({
  selectors: {
    '&:not(:first-of-type)': {
      marginTop: 40,
    }
  }
});

export const inner = style({
  marginTop: 20,
  selectors: {
    '&:not(:first-of-type)': {
      marginTop: 30,
    }
  }
});