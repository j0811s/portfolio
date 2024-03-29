import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "./common/variables.css";

export const html = style({
  height: '100%'
})

export const body = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  minHeight: '100%',
  color: `${vars.color.text.secondary}`,
  backgroundColor: `${vars.color.primary}`,
  '@media': {
    'screen and (min-width: 960px)': {
      gridTemplateRows: 'auto auto 1fr auto',
    }
  }
})

export const container = style({
  display: 'block',
  position: 'relative',
  overflow: 'hidden',
});