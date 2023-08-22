import { style } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const logo = style({
  fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  lineHeight: 1,
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
    }
  }
});