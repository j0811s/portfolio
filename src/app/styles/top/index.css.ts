import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      padding: '0 0 60px',
    },
    'screen and (min-width: 960px)': {
      padding: '60px 0',
    }
  }
});

export const section = style({
  margin: '0 auto',
  padding: '40px 16px',
  maxWidth: 1280,
  '@media': {
    'screen and (min-width: 600px)': {
      padding: '60px 24px',
    }
  },
  selectors: {
    '&:first-of-type': {
      marginTop: '30px',
      '@media': {
        'screen and (min-width: 600px)': {
          marginTop: '30px',
        }
      },
    },
    '&:last-of-type': {
      '@media': {
        'screen and (max-width: 599px)': {
          paddingBottom: '90px',
        }
      },
    }
  }
});

export const moreButtonContainer = style({
  textAlign: 'center',
  marginTop: '3em',
});