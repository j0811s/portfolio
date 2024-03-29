import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const postListTitle = style({
  color: `${vars.color.text.secondary}`,
  fontSize: `calc( 30 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.2,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 36 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 40 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const postList = style({
  display: 'flex',
  gap: 15,
  marginTop: 40,
  '@media': {
    'screen and (max-width: 599px)': {
      flexDirection: 'column',
      gap: 15,
    },
    'screen and (min-width: 600px)': {
      flexWrap: 'wrap',
      gap: 15,
    },
    'screen and (min-width: 1080px)': {
      gap: 15
    }
  }
});

export const postListItem = style({
  overflow: 'hidden',
  '@media': {
    'screen and (min-width: 600px)': {
      width: 'calc(50% - 10px)',
    },
    'screen and (min-width: 1080px)': {
      width: 'calc(100% / 3 - 10px)',
      transition: 'box-shadow .2s linear'
    }
  },
});

export const postListItemLink = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

export const postListWrapper = style({
  '@media': {
    'screen and (min-width: 960px)': {
      width: 'calc(100% - 300px)'
    }
  }
});

export const postData = style({
  display: 'flex',
  padding: '1em',
  flexDirection: 'column',
  flex: '1'
});

export const postDataTitle = style({
  color: `${vars.color.text.secondary}`,
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const postDataDesc = style({
  marginTop: 'auto',
  paddingTop: '0.5em'
});

export const postDateContainer = style({
  
});

export const postDate = style({
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  lineHeight: 1.4,
  textAlign: 'right',
  color: `${vars.color.gray.taupe}`,
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const postDateIcon = style({
  color: `${vars.color.gray.taupe}`,
  paddingRight: '0.5em'
});

export const postBtn = style({
  color: `${vars.color.text.secondary}`,
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  textAlign: 'right',
  padding: '0 1em 1.25em',
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
    }
  }
});

globalStyle(`${postListItem}:hover ${postBtn}`, {
  textDecoration: 'underline',
});