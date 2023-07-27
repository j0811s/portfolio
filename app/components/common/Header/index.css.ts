import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const container = style({
  display: 'block',
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 999,
  height: 60,
  padding: '0 1em',
  backgroundColor: '#fff',
  borderBottom: `1px solid ${vars.color.gray.default}`,
  color: '#000'
});

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%'
});

export const navigation = style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  '@media': {
    'screen and (max-width: 959px)': {
      position: 'fixed',
      top: 60,
      left: 0,
      width: '100%',
      height: 'calc(100% - 60px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      textAlign: 'center'
    },
    'screen and (min-width: 960px)': {
      display: 'block',
      marginLeft: 'auto',
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  },
  selectors: {
    ':not(.add-active) &': {
      '@media': {
        'screen and (max-width: 959px)': {
          display: 'none'
        }
      }
    },
    '.add-active &': {
      '@media': {
        'screen and (max-width: 959px)': {
          display: 'block'
        }
      }
    }
  }
});

export const navigationList = style({
  '@media': {
    'screen and (max-width: 959px)': {
      
    },
    'screen and (min-width: 960px)': {
      display: 'flex',
      alignItems: 'center',
    }
  }
});

export const navigationListItem = style({
  display: 'block',
  selectors: {
    '&:not(:first-of-type)': {
      '@media': {
        'screen and (min-width: 960px)': {
          marginLeft: '1em'
        }
      }
    }
  }
});

export const navigationListItemLink = style({
  display: 'block',
  padding: '0.25em 0',
  borderBottom: '1px solid transparent',
  transition: 'border-bottom 0.2s linear',
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: '#000'
        }
      }
    }
  }
});