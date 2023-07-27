import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";


export const postListEyecatchContainer = style({
  overflow: 'hidden',
  backgroundColor: '#F4F5F6',
});

export const postListEyecatch = style({
  aspectRatio: '16 / 9',
  objectFit: 'cover',
});

export const postListTitle = style({
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
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 30,
  '@media': {
    'screen and (min-width: 768px)': {
      gap: 15
    }
  }
});

export const postListItem = style({
  overflow: 'hidden',
  backgroundColor: '#fff',
  borderRadius: 12,
  '@media': {
    'screen and (max-width: 767px)': {
      width: 'calc(50% - 5px)',
    },
    'screen and (min-width: 768px)': {
      width: 'calc(100% / 3 - 10px)',
    }
  }
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
  padding: '0.5em',
  flexDirection: 'column',
  flex: '1'
});

export const postDataTitle = style({
  fontSize: `calc( 13 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 15 / ${vars.font.size} * 1rem )`,
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
  fontSize: `calc( 10 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.4,
  textAlign: 'left',
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const postBtn = style({
  textAlign: 'right',
  padding: '0 0.5em 0.75em',
});