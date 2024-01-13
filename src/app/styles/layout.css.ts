import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "./common/variables.css";

export const html = style({
  height: '100%'
})

export const body = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  minHeight: '100%',
  color: '#000',
  backgroundColor: `${vars.color.body}`
})

export const container = style({
  display: 'block',
  position: 'relative',
});

export const footer = style({
  display: 'block'
});