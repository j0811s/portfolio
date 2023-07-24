import { style, globalStyle, keyframes } from "@vanilla-extract/css";

export const btn = style({
  position: 'relative',
  cursor: 'pointer',
  fontSize: 10,
  marginTop: '-1em',
  marginLeft: 'auto',
  padding: '0.5em 0',
  '@media': {
    'screen and (max-width: 959px)': {
      width: '5em'
    },
    'screen and (min-width: 960px)': {
      display: 'none'
    }
  }
});

export const lines = style({
  position: 'relative',
  width: '50%',
  margin: '0 auto',
  height: '1.6em',
});

const lineAnim1 = keyframes({
  '0%': {
    top: 0,
  },
  '100%': {
    top: '50%',
    transform: 'translate(0, -50%) rotate(45deg)'
  }
});

const lineAnim2 = keyframes({
  '0%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0
  }
});

const lineAnim3 = keyframes({
  '0%': {
    bottom: 0,
  },
  '100%': {
    bottom: '50%',
    transform: 'translate(0, 50%) rotate(-45deg)'
  }
});

export const line = style({
  borderTop: '1px solid #000',
  position: 'absolute',
  width: '100%',
  left: 0,
  selectors: {
    '&:first-of-type': {
      top: 0,
      animation: `${lineAnim1} 0.2s forwards ease`,
      animationPlayState: 'paused'
    },
    '.add-modalOpen &:first-of-type': {
      animationPlayState: 'running'
    },
    '.add-modalClose &:first-of-type': {
      animationDirection: 'reverse',
      animationPlayState: 'running',
    },
    '&:nth-of-type(2)': {
      top: 'calc(50% - 1px)',
      opacity: 1,
      animation: `${lineAnim2} 0.2s forwards ease`,
      animationPlayState: 'paused',
    },
    '.add-modalOpen &:nth-of-type(2)': {
      animationPlayState: 'running'
    },
    '.add-modalClose &:nth-of-type(2)': {
      animationDirection: 'reverse',
      animationPlayState: 'running',
    },
    '&:nth-of-type(3)': {
      bottom: 0,
      animation: `${lineAnim3} 0.2s forwards ease`,
      animationPlayState: 'paused'
    },
    '.add-modalOpen &:nth-of-type(3)': {
      animationPlayState: 'running'
    },
    '.add-modalClose &:nth-of-type(3)': {
      animationDirection: 'reverse',
      animationPlayState: 'running',
    },
  }
});

export const textContainer = style({
  // pointerEvents: 'none',
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  textAlign: 'center',
});

export const text = style({
  selectors: {
    '.add-modalOpen &:first-of-type': {
      display: 'none'
    },
    ':not(.add-modalOpen) &:last-of-type': {
      display: 'none'
    },
    '.add-modalOpen &:last-of-type': {
      display: 'block'
    }
  }
});