import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  overflow: 'hidden',
  '@media': {
    'screen and (max-width: 959px)': {
      margin: '30px auto 0'
    }
  }
});

export const titleHead = style({
  position: 'relative'
});

export const title= style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  color: `${vars.color.text.secondary}`,
  backgroundColor: `${vars.color.secondary}`,
  padding: '1em',
  borderRadius: '4px',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const titleIcon = style({
  color: `${vars.color.gray.taupe}`
});

export const titleLabel = style({
  paddingLeft: '0.5em',
});

export const accordionTrigger = style({
  position: 'absolute',
  inset: 0,
  padding: '1em',
  zIndex: 1,
  textAlign: 'right',
});

export const accordionTriggerIcon = style({
  transition: 'transform 0.4s',
  selectors: {
    '&[data-open="false"]': {
      transform: 'rotateX(0.5turn)'
    }
  }
});

export const listContainer = style({
  display: 'grid',
  gridTemplateRows: '1fr',
  padding: '1em',
  transition: 'grid-template-rows 0.4s',
  selectors: {
    '&[data-open="false"]': {
      gridTemplateRows: '0fr',
    },
    '&[data-open="true"]': {
      gridTemplateRows: '1fr',
    }
  }
});

export const list = style({
  overflow: 'hidden',
});

export const listItem = style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  lineHeight: 1.2,
  selectors: {
    '&:not(:first-of-type)': {
      margin: '0.5em 0 0',
    },
    '&[data-level="3"]': {
      paddingLeft: '1em'
    },
    '&[data-level="4"]': {
      paddingLeft: '2em'
    },
    '&[data-level="5"]': {
      paddingLeft: '3em'
    },
    '&[data-level="6"]': {
      paddingLeft: '4em'
    }
  }
});

export const listIetmLink = style({
  color: `${vars.color.text.secondary}`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5em',
  backgroundColor: 'transparent',
  wordBreak: 'break-all',
  transition: 'border-color 0.2s linear',
  '@media': {
    'screen and (min-width: 960px)': {
      display: 'flex',
      borderLeft: '2px solid transparent',
    }
  },
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: `${vars.color.accent.sub}`
        }
      }
    }
  }
});