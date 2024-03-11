import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const btn = style({
  position: 'relative',
  cursor: 'pointer',
  fontSize: 10,
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
  borderTop: `1px solid ${vars.color.text.secondary}`,
  position: 'absolute',
  width: '100%',
  left: 0,
  selectors: {
    '&:first-of-type': {
      top: 0,
      animation: `${lineAnim1} 0.2s forwards ease`,
      animationPlayState: 'paused'
    },
    '.add-openModal &:first-of-type': {
      animationPlayState: 'running'
    },
    '.add-closeModal &:first-of-type': {
      animationDirection: 'reverse',
      animationPlayState: 'running',
    },
    '&:nth-of-type(2)': {
      top: 'calc(50% - 1px)',
      opacity: 1,
      animation: `${lineAnim2} 0.2s forwards ease`,
      animationPlayState: 'paused',
    },
    '.add-openModal &:nth-of-type(2)': {
      animationPlayState: 'running'
    },
    '.add-closeModal &:nth-of-type(2)': {
      animationDirection: 'reverse',
      animationPlayState: 'running',
    },
    '&:nth-of-type(3)': {
      bottom: 0,
      animation: `${lineAnim3} 0.2s forwards ease`,
      animationPlayState: 'paused'
    },
    '.add-openModal &:nth-of-type(3)': {
      animationPlayState: 'running'
    },
    '.add-closeModal &:nth-of-type(3)': {
      animationDirection: 'reverse',
      animationPlayState: 'running',
    },
  }
});