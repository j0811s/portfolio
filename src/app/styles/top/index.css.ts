import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const siteTitleContainer = style({
  display: 'grid',
  placeContent: 'center',
  height: '40vh',
  backgroundColor: `${vars.color.primary}`
});

export const siteTitle = style({
  textAlign: 'center',
  color: '#fff',
  fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
  '@media': {
    'screen and (min-width: 600px)': {
      fontSize: `calc( 48 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const section = style({
  margin: '0 auto',
  padding: '30px 16px',
  maxWidth: 1080,
  '@media': {
    'screen and (min-width: 600px)': {
      padding: '60px 24px',
    }
  },
  selectors: {
    '&:not(:first-of-type)': {
      paddingBottom: '120px',
      '@media': {
        'screen and (min-width: 600px)': {
          paddingBottom: '120px',
        }
      },
    }
  }
});

export const moreButtonContainer = style({
  textAlign: 'right',
  marginTop: '2.6em',
});

export const moreButton = style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  '@media': {
    'screen and (min-width: 600px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    },
  },
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          textDecoration: 'underline'
        }
      }
    }
  }
});