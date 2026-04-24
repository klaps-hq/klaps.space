"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

interface HeroParallaxProps {
  backdropSrc: string;
  alt: string;
  children: React.ReactNode;
}

const HeroParallax: React.FC<HeroParallaxProps> = ({
  backdropSrc,
  alt,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    [1, 0, 0]
  );

  const mouseXOffset = useMotionValue(0);
  const mouseYOffset = useMotionValue(0);
  const mouseXSpring = useSpring(mouseXOffset, { stiffness: 40, damping: 15 });
  const mouseYSpring = useSpring(mouseYOffset, { stiffness: 40, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (event.clientX - centerX) / (rect.width / 2);
    const dy = (event.clientY - centerY) / (rect.height / 2);
    mouseXOffset.set(dx * -8);
    mouseYOffset.set(dy * -8);
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-full rounded-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ x: mouseXSpring, y: mouseYSpring, scale: 1.04 }}
          >
            <Image
              src={backdropSrc}
              alt={alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              unoptimized
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

      <div className="pointer-events-none absolute inset-0 z-[3] opacity-[0.15] mix-blend-overlay">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <filter id="hero-grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain-filter)" />
        </svg>
      </div>

      <motion.div className="absolute inset-0 z-[4]" style={{ y: contentY }}>
        {children}
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[5] pointer-events-none"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.svg
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M6 1 L6 14 M1 9 L6 14 L11 9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroParallax;
