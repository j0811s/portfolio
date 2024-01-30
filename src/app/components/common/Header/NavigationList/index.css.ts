import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

const openModal = keyframes({
  '0%': {
    visibility: 'hidden',
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  },
  '100%': {
    visibility: 'visible',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  }
});

const closeModal = keyframes({
  '0%': {
    visibility: 'visible',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  '100%': {
    visibility: 'hidden',
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  }
});

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: 1280,
  margin: '0 auto',
  padding: '1rem',
});

export const navigation = style({
  position: 'relative',
  fontSize: `calc( 20 / ${vars.font.size} * 1rem )`,
  backgroundColor: 'rgb(30, 38, 38, 0.95)',
  padding: '1rem 1.5rem',
  selectors: {
    'body.is-pc &::before': {
      content: '',
      position: 'absolute',
      display: 'block',
      inset: 0,
      zIndex: -1,
      borderRadius: 9999,
      background: `radial-gradient(circle at calc(var(--x) * 1px) calc(var(--y) * 1px), rgb(205, 219, 181, 1), transparent 15vmin), transparent`,
      backgroundAttachment: 'fixed',
      mask: `linear-gradient(white, white) 50% 100% / 100% 1px no-repeat`,
    },
    '&[data-drawer-mode="false"]': {
      display: 'block',
      backdropFilter: 'blur(2px)',
      borderRadius: 9999,
      boxShadow: `0 0 1px ${vars.color.white}`,
      margin: '0 auto',
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const navigationList = style({
  display: 'flex',
  selectors: {
    '[data-drawer-mode="true"] &': {
      flexDirection: 'column',
      gap: '1em 0',
    },
    '[data-drawer-mode="false"] &': {
      alignItems: 'center',
    }
  }
});

export const navigationListItem = style({
  overflow: 'hidden',
  display: 'block',
  selectors: {
    '[data-drawer-mode="true"] &': {
      fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
    },
    '[data-drawer-mode="false"] &': {
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    },
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
  color: `${vars.color.text.white}`,
  selectors: {
    '[data-drawer-mode="true"] &': {
      '@media': {
        'screen and (max-width: 959px)': {
          visibility: 'hidden',
          opacity: 0,
          transform: 'translate3d(0, 100%, 0)',
        }
      },
    },
    '[data-drawer-mode="false"] &': {
      padding: '0.5em 1em',
    },
    '&[data-page-active="true"]': {
      backgroundColor: `${vars.color.white}`,
      color: `${vars.color.text.black}`,
    },
    '.add-openAnimation [data-drawer-mode="true"] &': {
      '@media': {
        'screen and (max-width: 959px)': {
          visibility: 'hidden',
          opacity: 0,
          transform: 'translate3d(0, 100%, 0)',
          animation: `${openModal} 0.4s 0.45s forwards ease`,
        },
      },
    },
    '.add-closeAnimation [data-drawer-mode="true"] &': {
      '@media': {
        'screen and (max-width: 959px)': {
          visibility: 'visible',
          opacity: 1,
          transform: 'translate3d(0, 0, 0)',
          animation: `${closeModal} 0.4s forwards ease`,
        },
      },
    }
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
          backgroundColor: `${vars.color.white}`,
          color: `${vars.color.text.black}`,
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

export const navigationItemIcon = style({
  color: 'inherit',
  selectors: {
    '[data-drawer-mode="true"] &': {
      marginRight: 16,
    },
    '[data-drawer-mode="false"] &': {
      marginRight: 8,
    },
  }
});

export const navigationItemGithubIcon = style({
  margin: 'auto',
  selectors: {
    '[data-drawer-mode="true"] &': {
      width: `calc( 40 / ${vars.font.size} * 1rem )`,
    },
    '[data-drawer-mode="false"] &': {
      width: `calc( 30 / ${vars.font.size} * 1rem )`,
    },
  }
});

globalStyle(`${navigationList}:hover a`, {
  '@media': {
    'screen and (min-width: 960px)': {
      backgroundColor: `transparent`,
      color: `${vars.color.text.white}`,
    }
  }
});