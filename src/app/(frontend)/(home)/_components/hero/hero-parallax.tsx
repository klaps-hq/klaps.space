"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

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

  return (
    <div ref={ref} className="relative w-full h-full rounded-2xl overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={backdropSrc}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={95}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

      <motion.div className="absolute inset-0" style={{ y: contentY }}>
        {children}
      </motion.div>
    </div>
  );
};

export default HeroParallax;
