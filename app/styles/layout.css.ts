import { style, globalStyle } from "@vanilla-extract/css";

export const html = style({
  height: '100%'
})

export const body = style({
  minHeight: '100%'
})

export const container = style({
  display: 'block',
  position: 'relative',
  '@media': {
    'screen and (max-width: 767px)': {
      padding: '30px 0',
    },
    'screen and (min-width: 768px)': {
      padding: '60px 0',
    }
  }
});

export const footer = style({
  position: 'sticky',
  top: '100vh'
})