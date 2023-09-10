import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  display: 'block',
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 999,
  width: '100%',
  height: 60,
  backgroundColor: '#fff',
  boxShadow: `0px 8px 8px -8px ${vars.color.gray.border}`,
  borderBottom: `1px solid ${vars.color.gray.border}`,
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
  fontSize: `calc( 20 / ${vars.font.size} * 1rem )`,
  '@media': {
    'screen and (min-width: 960px)': {
      display: 'block',
      marginLeft: 'auto',
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    }
  },
  selectors: {
    ':not(.add-open) &': {
      '@media': {
        'screen and (max-width: 959px)': {
          display: 'none'
        }
      }
    },
    '.add-open &': {
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
        'screen and (max-width: 959px)': {
          marginTop: '2em',
        },
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
  fontFeatureSettings: "'palt'",
  '@media': {
    'screen and (min-width: 960px)': {
      borderBottom: '2px solid transparent',
      transition: 'border-color 0.2s linear, color 0.2s linear',
    },
  },
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
      pointerEvents: 'none',
      color: `${vars.color.secondary}`,
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: `${vars.color.secondary}`,
        }
      }
    }
  }
});

export const navigationItemIcon = style({
  marginRight: 10,
  '@media': {
    'screen and (min-width: 960px)': {
      marginRight: 5,
    }
  }
});