import { style, globalStyle } from "@vanilla-extract/css";
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
  lineHeight: 1.2,
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

export const contents = style({
  '@media': {
    'screen and (min-width: 960px)': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }
});

globalStyle(`${contents} > dl`, {
  '@media': {
    'screen and (min-width: 960px)': {
      position: 'relative',
      width: '50%',
      padding: '0 30px',
      marginLeft: '0',
      marginRight: '0'
    }
  }
});

globalStyle(`${contents} > dl:nth-of-type(even)::before`, {
  '@media': {
    'screen and (min-width: 960px)': {
      content: '',
      display: 'block',
      width: 1,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: `${vars.color.gray.dark}`
    }
  }
});

globalStyle(`${contents} > dl:not(:first-of-type)`, {
  '@media': {
    'screen and (max-width: 959px)': {
      paddingTop: 30,
      borderTop: `1px solid ${vars.color.gray.dark}`
    }
  }
});