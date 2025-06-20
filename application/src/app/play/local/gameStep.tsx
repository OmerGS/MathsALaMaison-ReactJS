"use client";

import { motion, AnimatePresence } from "framer-motion";
import CategoryCarousel from "@/components/ui/game/CategoryCarousel";
import CategoryCard from "@/components/ui/game/CategoryCard";
import QuestionCard from "@/components/ui/game/QuestionCard";
import TimerCircle from '@/components/ui/game/TimerCircle';
import TimerBar from '@/components/ui/game/TimerBar';
import Category, { CategoryData } from "@/Type/Category";
import { categoryData } from "@/Type/CategoryData";
import useQuestionController from "../useQuestionController";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useIsMobile from "@/hooks/useIsMobile";
import Loading from "@/components/ui/global/Loading";
import { usePlayer } from "@/context/PlayerContext";
import CategoryStart from "@/components/ui/game/CategoryStart";

type Props = {
  category: Category | null;
  setCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  showCategory: boolean;
  setShowCategory: React.Dispatch<React.SetStateAction<boolean>>;
  readyForQuestion: boolean;
  setReadyForQuestion: React.Dispatch<React.SetStateAction<boolean>>;
  showQuestionCard: boolean;
  setShowQuestionCard: React.Dispatch<React.SetStateAction<boolean>>;
  categoriesArray: CategoryData[];
  onEndTurn: () => void;
  onReadyForQuestion: () => void;
};

export default function GameStep({
  category,
  setCategory,
  showCategory,
  setShowCategory,
  readyForQuestion,
  setReadyForQuestion,
  showQuestionCard,
  setShowQuestionCard,
  categoriesArray,
  onEndTurn,
  onReadyForQuestion,
}: Props) {
  const {
    currentQuestion,
    loading,
    possiblereponses,
    loadManager,
    fetchNextQuestion,
    fetchNextQuestionByCategorie,
    checkSelectionreponse,
    checkTextreponse,
    checkMultipleTextreponses,
  } = useQuestionController();

  const TIMER_DURATION = 45;
  const isMobile = useIsMobile();
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [questionKey, setQuestionKey] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { addPointToCurrentPlayer } = usePlayer();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategorySelected = (selectedCategoryName: string) => {
    let entry = Object.entries(categoryData).find(
      ([, value]) => value.name === selectedCategoryName
    );
    
    if (entry) {
      const selectedCategory = Number(entry[0]) as Category;
      const centre = selectedCategory;
      setCategory(selectedCategory);
      setShowCategory(true);
      setReadyForQuestion(false);
      setShowQuestionCard(false);
    }
  };

  useEffect(() => {
    if (loading || !currentQuestion || !readyForQuestion || hasAnswered) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, loading, currentQuestion, readyForQuestion, hasAnswered]);

  const handleAnswer = (isCorrect: boolean) => {
    if (hasAnswered) return;

    setHasAnswered(true);
    if (timerRef.current) clearTimeout(timerRef.current);


    if (isCorrect) {
      addPointToCurrentPlayer(1);
      toast.success("Bonne réponse !");
    } else {
      toast.error("Mauvaise réponse !");
    }

    setTimeout(() => {
      setHasAnswered(false);
      onEndTurn();
    }, 2000);
  };

  const startQuestion = async () => {
    await loadManager();
    category = Number(Category.Centre)
    if (!category || category === Number(Category.Centre)) {
      await fetchNextQuestion();
    } else {
      await fetchNextQuestionByCategorie(category);
    }
    setTimeLeft(TIMER_DURATION);
    setQuestionKey(k => k + 1);
    setReadyForQuestion(true);
    setShowQuestionCard(true);
    setShowCategory(false);
    onReadyForQuestion();
  };

  const handlereponseSelection = (reponse: string) => {
    const isCorrect = checkSelectionreponse(reponse);
    handleAnswer(isCorrect);
  };

  const handleTextreponseSelection = (reponse: string) => {
    const isCorrect = checkTextreponse(reponse);
    handleAnswer(isCorrect);
  };

  const handleMultipleTextreponse = (reponses: string[]) => {
    const isCorrect = checkMultipleTextreponses(reponses);
    handleAnswer(isCorrect);
  };

  const handleTimeUp = () => {
    handleAnswer(false);
  };


  const fadeSlideVariant = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
   };
   return (
    <div className="flex flex-col flex-1 w-full min-h-0">
      <AnimatePresence mode="wait">
          {!readyForQuestion && category === null && (
          <motion.div
              key="carousel"
              {...fadeSlideVariant}
              className="flex flex-col items-center justify-center w-full gap-4">
                <CategoryCarousel
                categories={categoriesArray}
                onCategorySelect={handleCategorySelected}
                />
          </motion.div>
          )}

          {showCategory && category !== null && !readyForQuestion && (
          <motion.div
              key="category-card"
              {...fadeSlideVariant}
              className="flex flex-col items-center justify-center w-full gap-4">
              <CategoryStart
                category={categoryData[category]}
                onStartQuestion={startQuestion}
                />
          </motion.div>
          )}

          {readyForQuestion && showQuestionCard && currentQuestion && (
          <motion.div
              key="question-card"
              {...fadeSlideVariant}
              className="flex flex-col items-center justify-center w-full gap-4">
                <TimerBar key={questionKey} duration={TIMER_DURATION} timeLeft={timeLeft} />
                <QuestionCard
                question={currentQuestion}
                possiblereponses={possiblereponses}
                onCheckSelection={handlereponseSelection}
                onCheckText={handleTextreponseSelection}
                onCheckMultipleText={handleMultipleTextreponse}
                />
          </motion.div>
          )}

          {readyForQuestion && showQuestionCard && !currentQuestion && (
          <motion.div
              key="loading"
              {...fadeSlideVariant}
              className="mt-20"
          >
              <Loading />
          </motion.div>
          )}
      </AnimatePresence>
      </div>
    );
}
