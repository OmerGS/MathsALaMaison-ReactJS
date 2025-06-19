import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { CategoryData } from "@/Type/Category";

interface CategoryCarouselProps {
  categories: CategoryData[];
  onCategorySelect: (categoryName: string) => void;
}

export default function CategoryCarousel({ categories, onCategorySelect }: CategoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRolling, setIsRolling] = useState(false);

  const rollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepsRef = useRef(0);

  const intervalDuration = 500;
  const animationDuration = intervalDuration / 1000;
  const maxSteps = categories.length * 3;

  const rollStep = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    stepsRef.current++;
    if (stepsRef.current >= maxSteps) stopRolling();
  };

  const startRolling = () => {
    if (isRolling) return;
    setIsRolling(true);
    stepsRef.current = 0;
    rollingIntervalRef.current = setInterval(rollStep, intervalDuration);
  };

  const stopRolling = () => {
    if (rollingIntervalRef.current) {
      clearInterval(rollingIntervalRef.current);
      rollingIntervalRef.current = null;
    }
    setIsRolling(false);
    const randomIndex = Math.floor(Math.random() * categories.length);
    setCurrentIndex(randomIndex);
    onCategorySelect(categories[randomIndex].name);
  };

  useEffect(() => {
    return () => {
      if (rollingIntervalRef.current) clearInterval(rollingIntervalRef.current);
    };
  }, []);

  const handleCardClick = () => {
    isRolling ? stopRolling() : startRolling();
  };

  return (
    <div className="flex items-center justify-center w-full gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={categories[currentIndex].name}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: animationDuration, ease: "easeInOut" }}
            className="w-full max-w-md flex justify-center items-center"
            style={{
              willChange: "transform, opacity",
              width: "100%",      // largeur à 80% du parent
              height: "auto",    // hauteur automatique selon contenu
              minWidth: "300px", // taille mini pour éviter trop petit
              minHeight: "400px" // hauteur mini pour garder constance
            }}
>
            <CategoryCard
              name={categories[currentIndex].name}
              imageUrl={categories[currentIndex].imageUrl}
              isSelected={true}
              onClick={handleCardClick}
              large={true}
            />
          </motion.div>
        </AnimatePresence>
    </div>
  );
}
