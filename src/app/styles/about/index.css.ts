import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  margin: '0 auto',
  padding: '30px 16px',
  maxWidth: 1080,
  '@media': {
    'screen and (min-width: 600px)': {
      padding: '60px 24px',
    }
  }
});

export const pageTitleContainer = style({
  color: '#fff',
  padding: `calc( 64 / ${vars.font.size} * 1rem ) calc( 16 / ${vars.font.size} * 1rem )`,
  backgroundColor: `${vars.color.primary}`,
  borderRadius: 24,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      padding: `calc( 80 / ${vars.font.size} * 1rem ) calc( 20 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      padding: `calc( 96 / ${vars.font.size} * 1rem ) calc( 24 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const pageTitle = style({
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

export const mainTitle = style({
  color: `${vars.color.text.white}`,
  fontSize: `calc( 22 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.2,
  fontWeight: 700,
  textAlign: 'left',
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 26 / ${vars.font.size} * 1rem )`,
    }
  }
});