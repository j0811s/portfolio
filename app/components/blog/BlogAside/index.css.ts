import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const asideContainer = style({
  display: 'block',
  '@media': {
    'screen and (max-width: 959px)': {
      marginTop: 60,
    },
    'screen and (min-width: 768px)': {
      position: 'sticky',
      top: 80,
      left: 0,
      height: '100%',
    },
    'screen and (min-width: 960px)': {
      width: 280
    }
  }
});

globalStyle(`${asideContainer} > div + div`, {
  margin: '15px 0 0',
});

globalStyle(`${asideContainer} > div > h2`, {
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  backgroundColor: '#eee',
  padding: '0.5em',
  borderRadius: '4px',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});