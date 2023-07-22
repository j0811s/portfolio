import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const container = style({
  display: 'block',
  padding: '1em',
  backgroundColor: '#fff',
  borderTop: '1px solid #eee',
  color: '#000',
  textAlign: 'center'
});

export const copyright = style({
  display: 'block',
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
});