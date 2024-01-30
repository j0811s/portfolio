import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const logo = style({
  fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  lineHeight: 1,
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const logoInner = style({
  display: 'flex',
  alignItems: 'center',
});

export const logoImg = style({
  display: 'block',
  border: '1px solid #000',
  borderRadius: 3,
  width: 30,
  marginRight: 10,
  '@media': {
    'screen and (min-width: 960px)': {
    }
  }
});

export const siteName = style({
  paddingBottom: 3,
  '@media': {
    'screen and (min-width: 960px)': {
    }
  }
});