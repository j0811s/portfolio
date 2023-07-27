import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const asideContainer = style({
  display: 'block',
  '@media': {
    'screen and (max-width: 959px)': {
      padding: '60px 0',
    },
    'screen and (min-width: 768px)': {
      position: 'sticky',
      top: 80,
      left: 0,
      height: '100%',
    },
    'screen and (min-width: 960px)': {
      width: 280
    }
  }
});

globalStyle(`${asideContainer} > * + *`, {
  margin: '30px 0 0',
});