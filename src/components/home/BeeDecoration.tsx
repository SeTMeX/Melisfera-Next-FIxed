"use client";

import { motion } from "framer-motion";

interface BeeDecorationProps {
  className?: string;
  delay?: number;
  duration?: number;
  reverse?: boolean;
  image?: string;
}

export const BeeDecoration = ({
  className = "",
  delay = 0,
  duration = 20,
  reverse = false,
  image = "/photos/mg.png",
}: BeeDecorationProps) => {
  return (
    <motion.div
      className={`absolute pointer-events-none opacity-30 sm:opacity-40 z-0 select-none hidden sm:block ${className}`}
      initial={{ y: reverse ? 100 : -100, x: reverse ? 50 : -50, rotate: reverse ? -15 : 15 }}
      animate={{ y: reverse ? -100 : 100, x: reverse ? -50 : 50, rotate: reverse ? 15 : -15 }}
      transition={{ duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay }}
    >
      <img src={image} alt="bee" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
    </motion.div>
  );
}