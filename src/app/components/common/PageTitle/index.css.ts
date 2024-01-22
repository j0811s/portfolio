import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  color: '#fff',
  textAlign: 'center',
  maxWidth: 1280
});

export const title = style({
  fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.2,
  fontWeight: 700,
  letterSpacing: '0.05em',
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

export const pageTitleBreadcrumb = style({
  '@media': {
    'screen and (max-width: 959px)': {
      marginBottom: `calc( 48 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      marginBottom: `calc( 48 / ${vars.font.size} * 1rem )`,
    }
  },
});