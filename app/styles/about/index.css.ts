import { style } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const container = style({
  padding: '30px 0 60px',
  '@media': {
    'screen and (min-width: 600px)': {
      padding: '30px 0 90px',
    }
  }
});

export const mainTitle = style({
  fontSize: `calc( 30 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 36 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 40 / ${vars.font.size} * 1rem )`,
    }
  }
});