import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "./common/variables.css";

export const html = style({
  height: '100%'
})

export const body = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  minHeight: '100%',
  // color: '#fff',
  color: `${vars.color.text.gray}`,
  backgroundColor: `${vars.color.primary}`
})

export const container = style({
  display: 'block',
  position: 'relative',
  overflow: 'hidden',
});

export const footer = style({
  display: 'block'
});