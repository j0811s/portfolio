import { logoWrap, logo, logoName } from "./index.css";
import useInView from "../../../hooks/useInView";
import Image from "next/image";
import { useRef } from "react";

type Logo = {
  url: string
  height: number
  width: number
  name: string
}

export const SkillLogo = ({ url, width, height, name }: Logo) => {
  const logoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(logoRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  }, true);

  return (
    <figure className={logoWrap} ref={logoRef} data-in-view={isInView}>
      <Image className={logo} src={url} width={width} height={height} alt={name} />
      <figcaption className={logoName}>{name}</figcaption>
    </figure>
  )
}