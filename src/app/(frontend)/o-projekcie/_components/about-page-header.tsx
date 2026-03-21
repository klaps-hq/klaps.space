"use client";

import React from "react";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const AboutPageHeader: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Breadcrumbs items={[{ name: "O projekcie" }]} />
      </motion.div>

      <div className="flex flex-col gap-4">
        <motion.p
          className="text-blood-red text-sm font-semibold uppercase tracking-[0.15em]"
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          O projekcie
        </motion.p>

        <motion.h1
          className="text-white text-4xl md:text-6xl font-black uppercase tracking-tight leading-none"
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Klaps
        </motion.h1>

        <motion.div
          className="h-0.5 bg-blood-red"
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </motion.div>
  );
};

export default AboutPageHeader;
