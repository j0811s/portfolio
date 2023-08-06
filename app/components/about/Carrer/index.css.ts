import { style } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const container = style({
  display: 'block',
  maxWidth: 960,
  margin: '40px auto 0',
  padding: '0 16px',
  '@media': {
    'screen and (min-width: 960px)': {
      margin: '60px auto 0',
      padding: '0 30px'
    }
  }
});

export const mainTitle = style({
  fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 18 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 20 / ${vars.font.size} * 1rem )`,
    }
  },
});

export const readText = style({
  display: 'block',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  lineHeight: '1.6',
  textIndent: '-1em',
  paddingLeft: '1em',
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  },
  selectors: {
    '&:first-of-type': {
      marginTop: 10,
    }
  }
});