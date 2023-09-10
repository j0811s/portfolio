import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  '@media': {
    'screen and (min-width: 960px)': {
      
    }
  },
});

export const warapper = style({
  position: 'relative',
  display: 'block',
  margin: '40px auto 0',
  padding: '40px 0',
  '@media': {
    'screen and (min-width: 960px)': {
      margin: '50px auto 0',
    }
  },
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: '1.5em',
      bottom: 0,
      display: 'block',
      width: 6,
      backgroundColor: `${vars.color.gray.bg}`,
      zIndex: '-1',
    }
  }
});

export const data = style({
  paddingLeft: 'calc(1.5em - 20px)',
  '@media': {
    'screen and (min-width: 960px)': {
      
    }
  },
  selectors: {
    '&:not(:first-of-type)': {
      marginTop: 30,
    }
  }
});

export const iconContainer = style({
  position: 'relative',
  marginRight: '1.5em',
  selectors: {
    '&::before': {
      content: '',
      display: 'block',
      width: 40,
      height: 40,
      border: `2px solid #fff`,
      borderRadius: 9999,
      backgroundColor: `${vars.color.tertiary}`,
      boxShadow: `0 0 4px ${vars.color.gray.border}`,
    }
  }
});

export const icon = style({
  color: '#fff',
  fill: 'currentcolor',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
});

export const mainTitle = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 18 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 20 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const readText = style({
  display: 'block',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  lineHeight: '1.6',
  marginTop: '0.5em',
  marginLeft: '5em',
  textIndent: '-1em',
  paddingLeft: '1em',
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});