import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const loaderContainer = style({
  position: 'fixed',
  inset: 0,
  zIndex: 'calc(infinity)',
  backgroundColor: `${vars.color.primary}`,
});

const load = keyframes({
  '0%': {
    boxShadow: '0 0',
    height: '4em'
  },
  '40%': {
    boxShadow: '0 -2em',
    height: '5em'
  },
  '80%': {
    boxShadow: '0 0',
    height: '4em'
  },
  '100%': {
    boxShadow: '0 0',
    height: '4em'
  }
});

export const loader = style({
  color: `${vars.color.accent.main}`,
  textIndent: '-9999em',
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  zIndex: 10,
  fontSize: 10,
  transform: 'translateZ(0)',
  animationDelay: '-0.16s',
  backgroundColor: `${vars.color.accent.main}`,
  animation: `${load} 1s infinite ease-in-out`,
  width: '1em',
  height: '4em',
  selectors: {
    '&::before, &::after': {
      position: 'absolute',
      top: 0,
      content: '',
      backgroundColor: `${vars.color.accent.main}`,
      animation: `${load} 1s infinite ease-in-out`,
      width: '1em',
      height: '4em',
    },
    '&::before': {
      left: '-1.5em',
      animationDelay: '-0.32s'
    },
    '&::after': {
      left: '1.5em',
      animationDelay: '-0.32s'
    }
  }
});