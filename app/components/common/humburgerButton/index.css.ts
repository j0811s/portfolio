import { style, globalStyle } from "@vanilla-extract/css";

export const container = style({
  position: 'relative',
  cursor: 'pointer',
  fontSize: 10,
  marginTop: '-1em',
  marginLeft: 'auto',
  '@media': {
    'screen and (max-width: 767px)': {
      width: '5em'
    },
    'screen and (min-width: 768px)': {
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

export const line = style({
  borderTop: '1px solid #000',
  position: 'absolute',
  width: '100%',
  left: 0,
  selectors: {
    '&:first-of-type': {
      top: 0,
      transition: 'top .2s linear, transform .2s linear'
    },
    '.add-active &:first-of-type': {
      top: '50%',
      transform: 'translate(0, -50%) rotate(45deg)'
    },
    '&:nth-of-type(2)': {
      top: 'calc(50% - 1px)',
      transition: 'opacity .2s linear'
    },
    '.add-active &:nth-of-type(2)': {
      opacity: 0
    },
    '&:nth-of-type(3)': {
      bottom: 0,
      transition: 'bottom .2s linear, transform .2s linear'
    },
    '.add-active &:nth-of-type(3)': {
      bottom: '50%',
      transform: 'translate(0, 50%) rotate(-45deg)'
    },
  }
});

export const textContainer = style({
  position: 'absolute',
  top: '100%',
  width: '100%',
  textAlign: 'center',
  marginTop: '.6em',
});

export const text = style({
  selectors: {
    '.add-active &:first-of-type': {
      display: 'none'
    },
    ':not(.add-active) &:last-of-type': {
      display: 'none'
    },
    '.add-active &:last-of-type': {
      display: 'block'
    }
  }
});