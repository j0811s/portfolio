'use client';

import { srOnly, movie, movieContainer, controlButtons, controlButton, controlButtonIcon } from "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

export const Movie = ({ src, autoplay = false }: { src: string, autoplay: boolean }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    isPlaying ? videoRef.current?.play() : videoRef.current?.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlay = () => {
    setIsPlaying(() => true);
    videoRef.current?.play();
  }

  const onPause = () => {
    setIsPlaying(() => false);
    videoRef.current?.pause();
  }

  const controlMovie = () => {
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
      <video className={movie} playsInline muted loop src={src} ref={videoRef}></video>
      <div className={controlButtons}>
        <button className={controlButton} type="button" onClick={controlMovie}>
          <ControlButtonIcon />
        </button>
      </div>
    </div>
  )
}