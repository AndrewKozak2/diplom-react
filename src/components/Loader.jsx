import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.img
        src="/images/logo.png"
        alt="TrueScale"
        className="h-20 w-auto filter brightness-0 contrast-100"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="text-gray-700 text-sm font-semibold tracking-wide"
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
        }}
      >
        Loading car...
      </motion.div>
    </motion.div>
  );
}
