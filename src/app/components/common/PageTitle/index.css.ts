import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  color: '#fff',
  padding: `calc( 56 / ${vars.font.size} * 1rem ) calc( 24 / ${vars.font.size} * 1rem )`,
  backgroundColor: `${vars.color.primary}`,
  borderRadius: 24,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      padding: `calc( 64 / ${vars.font.size} * 1rem ) calc( 28 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      padding: `calc( 64 / ${vars.font.size} * 1rem ) calc( 28 / ${vars.font.size} * 1rem )`,
    }
  },
  selectors: {
    '&.mod-page': {
      padding: `calc( 32 / ${vars.font.size} * 1rem ) calc( 32 / ${vars.font.size} * 1rem )`,
    }
  }
});


export const title = style({
  fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.2,
  fontWeight: 700,
  letterSpacing: '0.05em',
  marginTop: `calc( 10 / ${vars.font.size} * 1rem )`,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
    }
  },
  selectors: {
    '&.mod-page': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
      '@media': {
        'screen and (min-width: 600px) and (max-width: 959px)': {
          fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
        },
        'screen and (min-width: 960px)': {
          fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
        }
      },
    }
  }
});