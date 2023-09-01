import { style } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const skillContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  alignContent: 'flex-start',
  gap: 15,
  margin: `calc( 40 / ${vars.font.size} * 1rem ) auto 0`,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    'screen and (min-width: 960px)': {
      gridTemplateColumns: 'repeat(6, 1fr)',
      margin: `calc( 50 / ${vars.font.size} * 1rem ) auto 0`,
    }
  }
});

export const skillTitle = style({
  display: 'grid',
  gridColumn: '1 / 4',
  textAlign: 'left',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 500,
  marginBottom: '0.5em',
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      gridColumn: '1 / 5',
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      gridColumn: '1 / 7',
      fontSize: `calc( 18 / ${vars.font.size} * 1rem )`,
    }
  },
});

export const skillItem = style({
  display: 'block',
  border: `1px solid ${vars.color.gray.hoverBg}`,
  borderRadius: 10,
  padding: '1em',
  minWidth: 0,
});

export const logoWrap = style({
  width: '100%',
  height: '100%'
});

export const logo = style({
  position: 'relative !important' as 'relative',
  display: 'block',
  width: 'auto!important',
  maxWidth: '100%',
  height: `calc( 40 / ${vars.font.size} * 1rem )!important`,
  margin: '0 auto',
  objectFit: 'contain',
});

export const logoName = style({
  display: 'block',
  textAlign: 'center',
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  fontWeight: 500,
  lineHeight: '1.2',
  marginTop: '1.5em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});