import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const readText = style({
  display: 'block',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  lineHeight: '1.6',
  marginTop: '0.5em',
  marginLeft: `calc( 78 / ${vars.font.size} * 1rem )`,
  textAlign: 'justify',
  '@media': {
    'screen and (min-width: 600px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
      marginLeft: `calc( 84 / ${vars.font.size} * 1rem )`,
    },
  }
});

export const textBold = style({
  fontWeight: 700,
  borderBottom: `1px solid ${vars.color.white}`,
  borderColor: 'inherit',
  paddingBottom: '0.25em'
});

globalStyle(`${readText} + ${textBold}`, {
  marginTop: '1.25em',
});