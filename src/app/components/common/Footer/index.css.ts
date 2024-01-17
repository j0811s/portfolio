import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  display: 'block',
  color: '#fff',
  textAlign: 'center',
  backgroundColor: `${vars.color.secondary}`,
});

export const copyright = style({
  display: 'block',
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  padding: '1em'
});