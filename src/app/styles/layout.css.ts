import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "./common/variables.css";

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
    'screen and (min-width: 960px)': {
      padding: '30px 0 90px',
    }
  }
});

export const footer = style({
  position: 'sticky',
  top: '100vh'
});