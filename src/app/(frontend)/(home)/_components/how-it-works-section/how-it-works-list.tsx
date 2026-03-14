"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import HowItWorksStep from "./how-it-works-step";
import {
  reducedMotionStaggerContainerVariants,
  reducedMotionStaggerItemVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/animations/motion-presets";

const STEPS = [
  {
    number: "01",
    title: "Zbieramy repertuar",
    description:
      "Dane pobieramy z publicznych źródeł kin w całej Polsce. Aktualizujemy je regularnie.",
  },
  {
    number: "02",
    title: "Filtrujemy seanse",
    description:
      "Skupiamy się na pokazach specjalnych, klasyce, retrospektywach i wznowieniach. Na filmach, które łatwo przeoczyć wśród premier.",
  },
  {
    number: "03",
    title: "Pokazujemy w jednym miejscu",
    description:
      "Wszystkie seanse trafiają na jedną stronę. Filtrujesz po mieście, gatunku lub dacie i znajdujesz to, co Cię interesuje.",
  },
];

const HowItWorksList: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainerVariants
    : staggerContainerVariants;

  const itemVariants = prefersReducedMotion
    ? reducedMotionStaggerItemVariants
    : staggerItemVariants;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {STEPS.map((step) => (
        <motion.div key={step.number} variants={itemVariants}>
          <HowItWorksStep
            number={step.number}
            title={step.title}
            description={step.description}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default HowItWorksList;
