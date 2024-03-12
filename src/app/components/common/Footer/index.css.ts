import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  display: 'block',
  color: `${vars.color.text.secondary}`,
  backgroundColor: `${vars.color.background.primary}`,
  textAlign: 'center',
});



export const navigation = style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  backgroundColor: 'transparent',
  margin: '1em 0 0',
  '@media': {
    'screen and (min-width: 960px)': {
      backgroundColor: `${vars.color.background.primary}`,
    }
  }
});

export const navigationList = style({
  display: 'flex',
  justifyContent: 'center',
});

export const navigationListItem = style({
  overflow: 'hidden',
  display: 'block',
  selectors: {
    '&.mod-github': {
      '@media': {
        'screen and (max-width: 959px)': {
          marginTop: '1em',
        },
        'screen and (min-width: 960px)': {
          marginLeft: '1em',
        }
      },
    }
  }
});

export const navigationListItemLink = style({
  display: 'block',
  fontWeight: 400,
  padding: '0.5em 1em',
  borderRadius: 9999,
  fontFeatureSettings: "'palt'",
  color: `${vars.color.text.secondary}`,
  selectors: {
    '&[data-page-active="true"]': {
      backgroundColor: `${vars.color.accent.main}`,
      color: `${vars.color.text.btn}`,
    },
  }
});

export const navigationListItemLinkHover = style({
  selectors: {
    '&:not(.mod-icon)': {
      '@media': {
        'screen and (min-width: 960px)': {
          transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',
        }
      }
    },
    '&:not(.mod-icon):hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          backgroundColor: `${vars.color.accent.main}`,
          color: `${vars.color.text.btn}`,
        }
      }
    },
    '&.mod-icon': {
      '@media': {
        'screen and (min-width: 960px)': {
          transition: 'opacity 0.2s ease-in-out',
        }
      }
    },
    '&.mod-icon:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          opacity: 0.7,
        }
      }
    },
  }
});

globalStyle(`${navigationList}:hover a`, {
  '@media': {
    'screen and (min-width: 960px)': {
      backgroundColor: `transparent`,
      color: `${vars.color.text.secondary}`,
    }
  }
});

export const copyright = style({
  display: 'block',
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  padding: '1em'
});