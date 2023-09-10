import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  display: 'block',
  color: '#000',
  textAlign: 'center',
});

export const pageTop = style({
  display: 'block',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  letterSpacing: '0.1em',
  color: '#fff',
  backgroundColor: `${vars.color.secondary}`,
  padding: '1em',
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  },
});

export const copyright = style({
  display: 'block',
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  backgroundColor: `${vars.color.gray.default}`,
  padding: '1em'
});