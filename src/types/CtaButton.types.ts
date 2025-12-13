import type { ComponentProps } from "react";
import Link from 'next/link';

export type ButtonActionProps = ComponentProps<'button'> & {
  prevIcon?: boolean;
  nextIcon?: boolean;
  crossIcon?: boolean;
}

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  prevIcon?: boolean;
  nextIcon?: boolean;
  crossIcon?: boolean;
}
