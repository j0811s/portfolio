import { style, globalStyle, keyframes } from "@vanilla-extract/css";

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
  color: '#000',
  textIndent: '-9999em',
  position: 'fixed',
  inset: 0,
  margin: 'auto',
  zIndex: 10,
  fontSize: '11px',
  transform: 'translateZ(0)',
  animationDelay: '-0.16s',
  backgroundColor: '#000',
  animation: `${load} 1s infinite ease-in-out`,
  width: '1em',
  height: '4em',
  '@media': {
    'screen and (min-width: 960px)': {
    }
  },
  selectors: {
    '&::before, &::after': {
      position: 'absolute',
      top: 0,
      content: '',
      backgroundColor: '#000',
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