import { style } from "@vanilla-extract/css";

export const container = style({
  textAlign: 'center'
});

export const pageTitle = style({
  fontSize: 26,
  fontWeight: 700,
  '@media': {
    '(min-width: 960px)': {
      fontSize: 40,
    }
  }
});

export const pageSubTitle = style({
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.6,
  marginTop: 15,
  '@media': {
    '(min-width: 960px)': {
      fontSize: 18,
      marginTop: 20,
    }
  }
});

export const ctaButton = style({
  marginTop: 40,
  selectors: {
    ['&:not(:first-of-type)']: {
      marginTop: 20
    }
  }
});