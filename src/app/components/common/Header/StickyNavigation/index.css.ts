import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const navigationWrapper = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 1280,
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 959px)': {
      display: 'none'
    },
    'screen and (min-width: 960px)': {
      position: 'sticky',
      top: '2rem',
      left: 0,
      zIndex: 9999,
      margin: '2rem auto',
    }
  },
});