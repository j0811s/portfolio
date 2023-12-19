import { style } from "@vanilla-extract/css";

export const container = style({
  display: 'grid',
  placeContent: 'center',
  textAlign: 'center',
  height: '100%'
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
      marginTop: 25,
    }
  }
});

export const ctaButtonContainer = style({
  display: 'grid',
  gap: '1em',
  width: 'fit-content',
  margin: '25px auto 0',
  '@media': {
    '(min-width: 600px)': {
      margin: '40px auto 0',
      gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))',
    }
  }
});