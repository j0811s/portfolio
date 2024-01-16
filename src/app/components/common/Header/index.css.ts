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
  backgroundColor: 'rgb(30, 38, 38, 0.85)',
  backdropFilter: 'blur(2px)',
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
    'screen and (max-width: 959px)': {
      display: 'flex',
      flexDirection: 'column',
      gap: '2em 0',
    },
    'screen and (min-width: 960px)': {
      display: 'flex',
      alignItems: 'center',
      gap: '0 1.5em',
    }
  }
});

export const navigationListItem = style({
  display: 'block',
  '@media': {
    'screen and (max-width: 959px)': {
      fontSize: `calc( 18 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const navigationListItemLink = style({
  display: 'block',
  fontWeight: 500,
  padding: '0.25em 0',
  fontFeatureSettings: "'palt'",
  color: '#fff',
  '@media': {
    'screen and (min-width: 960px)': {
      transition: 'opacity 0.2s linear',
    },
  },
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          opacity: '0.7'
        }
      }
    },
    '&[data-page-active="true"]': {
      // pointerEvents: 'none',
      // color: `${vars.color.secondary}`
    }
  }
});

export const navigationItemIcon = style({
  marginRight: 16,
  '@media': {
    'screen and (min-width: 960px)': {
      marginRight: 8,
    }
  }
});