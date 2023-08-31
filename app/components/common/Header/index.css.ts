import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const container = style({
  display: 'block',
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 999,
  height: 60,
  backgroundColor: '#fff',
  boxShadow: `0px 0px 8px ${vars.color.gray.border}`,
  color: '#000',
});

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 1280,
  height: '100%',
  margin: '0 auto',
  padding: '0 1em',
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
  fontWeight: 500,
  padding: '0.25em 0',
  borderBottom: '2px solid transparent',
  transition: 'border-color 0.2s linear, color 0.2s linear',
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: `${vars.color.secondary}`,
          color: `${vars.color.secondary}`
        }
      }
    },
    '&[data-page-active="true"]': {
      borderColor: `${vars.color.secondary}`,
      color: `${vars.color.secondary}`
    }
  }
});