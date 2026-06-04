"use client";

import React, { useRef } from "react";

const WILHELM_SRC = "/audio/wilhelm-scream.mp3";

const WilhelmEgg: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(WILHELM_SRC);
      audioRef.current.preload = "auto";
    }
    const audio = audioRef.current;
    audio.volume = 0.3;
    audio.currentTime = 0;
    audio.play().catch(() => undefined);
  };

  return (
    <button
      type="button"
      onClick={play}
      aria-label="Klaps"
      title="Klaps"
      className="shrink-0 cursor-pointer outline-none transition-opacity hover:opacity-75 focus-visible:opacity-75"
    >
      <svg
        viewBox="0 0 28 20"
        className="w-[16vw] h-auto text-white block"
        fill="currentColor"
        aria-hidden="true"
      >
        <polygon points="0,8 28,0 28,20 0,12" />
      </svg>
    </button>
  );
};

export default WilhelmEgg;
