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

export const container = style({
  display: 'block',
  position: 'relative',
  zIndex: 9999,
  width: '100%',
  backgroundColor: `${vars.color.background.primary}`,
  backdropFilter: 'blur(2px)',
  boxShadow: `0 0 1px ${vars.color.border.main}`,
  '@media': {
    'screen and (max-width: 959px)': {
      position: 'sticky',
      top: 0,
      left: 0,
    }
  },
  selectors: {
    'body.is-pc &::before': {
      content: '',
      position: 'absolute',
      display: 'block',
      inset: 0,
      zIndex: -1,
      background: `radial-gradient(circle at calc(var(--x) * 1px) calc(var(--y) * 1px), rgb(205, 219, 181, 1), transparent 15vmin), transparent`,
      backgroundAttachment: 'fixed',
      mask: `
        linear-gradient(white, white) 50% 100% / 100% 1px no-repeat
      `,
    },
  }
});

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: 1280,
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 959px)': {
      padding: '1rem',
    },
    'screen and (min-width: 960px)': {
      padding: '0.5rem',
    },
  },
});

export const navigationListItem = style({
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5em',
  '@media': {
    'screen and (max-width: 959px)': {
      fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    }
  },
  selectors: {
    '&.mod-github': {
      '@media': {
        'screen and (max-width: 959px)': {
          marginTop: '1em',
        },
        'screen and (min-width: 960px)': {
          margin: '0 1em',
        }
      },
    },
    '&.util-sp': {
      '@media': {
        'screen and (min-width: 960px)': {
          display: 'none'
        }
      },
    },
    '&.util-pc': {
      '@media': {
        'screen and (max-width: 959px)': {
          display: 'none'
        },
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
  '@media': {
    'screen and (max-width: 959px)': {
      visibility: 'hidden',
      opacity: 0,
      transform: 'translate3d(0, 100%, 0)',
    },
    'screen and (min-width: 960px)': {
      padding: '0.5em 1em',
    },
  },
  selectors: {
    '&[data-page-active="true"]': {
      backgroundColor: `${vars.color.background.secondary}`,
      color: `${vars.color.text.primary}`,
    },
    ".add-openAnimation &": {
      '@media': {
        'screen and (max-width: 959px)': {
          visibility: 'hidden',
          opacity: 0,
          transform: 'translate3d(0, 100%, 0)',
          animation: `${openModal} 0.4s 0.45s forwards ease`,
        },
      },
    },
    ".add-closeAnimation &": {
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
          backgroundColor: `${vars.color.background.secondary}`,
          color: `${vars.color.text.primary}`,
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

export const navigationItemGithubIcon = style({
  margin: 'auto',
  '@media': {
    'screen and (max-width: 959px)': {
      width: `calc( 40 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      width: `calc( 30 / ${vars.font.size} * 1rem )`,
    }
  }
});