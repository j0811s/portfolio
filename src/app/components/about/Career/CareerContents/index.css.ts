import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const data = style({
  position: 'relative',
  zIndex: 3,
  paddingLeft: 'calc(1.5em - 20px)',
  '@media': {
    'screen and (min-width: 960px)': {
      
    }
  },
  selectors: {
    '&:not(:first-of-type)': {
      marginTop: 30,
    }
  }
});