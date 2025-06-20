"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AnimatedNumber({ value }: { value: number }) {
  const oldValue = useRef(value);
  const valueStr = String(value);
  const oldValueStr = String(oldValue.current).padStart(valueStr.length, "0");

  useEffect(() => {
    oldValue.current = value;
  }, [value]);

  return (
    <div className="inline-flex text-3xl font-semibold text-gray-800 font-mono">
    {valueStr.split("").map((char, index) => {
        const oldChar = oldValueStr[index];
        const key = `${index}-${char}`;
        const hasChanged = char !== oldChar;

        return (
        <div key={index} className="relative w-[1ch] h-10 overflow-hidden text-center">
            <AnimatePresence mode="wait" initial={false}>
            {hasChanged ? (
                <motion.div
                key={key}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute w-full"
                >
                {char}
                </motion.div>
            ) : (
                <motion.div key={key} className="absolute w-full">
                {char}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
        );
    })}
    </div>
  );
}