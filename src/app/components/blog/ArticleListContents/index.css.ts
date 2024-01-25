import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const postListWrapper = style({
  '@media': {
    'screen and (min-width: 960px)': {
      width: 'calc(100% - 300px)'
    }
  }
});