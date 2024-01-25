'use client';

import { srOnly, movie, movieContainer, controlButtons, controlButton, controlButtonIcon } from "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import useInView from "../../hooks/useInView";

export const Movie = ({ src, autoplay = false }: { src: string, autoplay: boolean }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0
  }, false);

  useEffect(() => {
    isInView ? onPlay() : onPause();
  }, [isInView]);

  const onPlay = () => {
    setIsPlaying(() => true);
    videoRef.current?.play();
  }

  const onPause = () => {
    setIsPlaying(() => false);
    videoRef.current?.pause();
  }

  const onControlMovie = () => {
    isPlaying ? onPause() : onPlay();
  }

  const ControlButtonIcon = () => {
    return (
      isPlaying
        ? <><FontAwesomeIcon className={controlButtonIcon} icon={faPause} /><span className={srOnly}>動画を一時停止する</span></>
        : <><FontAwesomeIcon className={controlButtonIcon} icon={faPlay} /><span className={srOnly}>動画を再生する</span></>
    )
  }

  return (
    <div className={movieContainer}>
      <video className={movie} playsInline muted loop src={src} ref={videoRef} data-in-view={isInView}></video>
      <div className={controlButtons}>
        <button className={controlButton} type="button" onClick={onControlMovie}>
          <ControlButtonIcon />
        </button>
      </div>
    </div>
  )
}