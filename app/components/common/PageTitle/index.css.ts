import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const container = style({
  marginTop: 30,
  color: '#fff',
  padding: `calc( 64 / ${vars.font.size} * 1rem ) calc( 24 / ${vars.font.size} * 1rem )`,
  backgroundColor: `${vars.color.primary}`,
  borderRadius: 24,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      padding: `calc( 80 / ${vars.font.size} * 1rem ) calc( 28 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      padding: `calc( 96 / ${vars.font.size} * 1rem ) calc( 32 / ${vars.font.size} * 1rem )`,
    }
  }
});


export const title = style({
  fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.2,
  fontWeight: 700,
  letterSpacing: '0.05em',
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 40 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 48 / ${vars.font.size} * 1rem )`,
    }
  }
});