import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

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
    '&:first-of-type': {
      marginTop: '30px',
      '@media': {
        'screen and (min-width: 600px)': {
          marginTop: '30px',
        }
      },
    },
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
  textAlign: 'center',
  marginTop: '3em',
});