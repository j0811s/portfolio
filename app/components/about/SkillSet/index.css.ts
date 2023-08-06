import { style } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const skillContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  alignContent: 'flex-start',
  gap: 15,
  maxWidth: 600,
  margin: '30px auto 0',
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
    },
    'screen and (min-width: 960px)': {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: 20,
      margin: '80px auto 0',
    }
  }
});

export const skillTitle = style({
  display: 'grid',
  gridColumn: '1 / 4',
  textAlign: 'center',
  fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  marginBottom: 10,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      gridColumn: '1 / 5',
      fontSize: `calc( 18 / ${vars.font.size} * 1rem )`,
      marginBottom: 20,
    },
    'screen and (min-width: 960px)': {
      gridColumn: '1 / 5',
      fontSize: `calc( 20 / ${vars.font.size} * 1rem )`,
      marginBottom: 20,
    }
  },
});

export const skillItem = style({
  display: 'grid',
});

export const logoWrap = style({
  width: '100%',
  height: '100%'
});

export const logo = style({
  display: 'block',
  width: `calc( 64 / ${vars.font.size} * 1rem )`,
  height: `calc( 64 / ${vars.font.size} * 1rem )`,
  margin: '0 auto',
  objectFit: 'contain',
  '@media': {
    'screen and (min-width: 600px)': {
      width: `calc( 80 / ${vars.font.size} * 1rem )`,
      height: `calc( 80 / ${vars.font.size} * 1rem )`,
    }
  },
});

export const logoName = style({
  display: 'block',
  textAlign: 'center',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  lineHeight: 1,
  marginTop: 10,
  wordBreak: 'break-word',
  '@media': {
    'screen and (min-width: 600px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  },
});