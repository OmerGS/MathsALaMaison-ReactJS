"use client";

import { motion, AnimatePresence } from "framer-motion";
import CategoryCarousel from "@/components/ui/CategoryCarousel";
import CategoryCard from "@/components/ui/CategoryCard";
import QuestionCard from "@/components/ui/QuestionCard";
import TimerCircle from '@/components/ui/TimerCircle';
import TimerBar from '@/components/ui/TimerBar';
import Category, { CategoryData } from "@/Type/Category";
import { categoryData } from "@/Type/CategoryData";
import useQuestionController from "../useQuestionController";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useIsMobile from "@/hooks/useIsMobile";
import Loading from "@/components/ui/Loading";
import { usePlayer } from "@/context/PlayerContext";

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
  const [showCorrection, setShowCorrection] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { currentPlayer, addPointToCurrentPlayer } = usePlayer();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategorySelected = (selectedCategoryName: string) => {
    const entry = Object.entries(categoryData).find(
      ([, value]) => value.name === selectedCategoryName
    );
    if (entry) {
      const selectedCategory = Number(entry[0]) as Category;
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

    setLastAnswerCorrect(isCorrect);
    setShowCorrection(true);

    if (isCorrect) {
      addPointToCurrentPlayer(1);
      toast.success("Bonne réponse !");
    } else {
      toast.error("Mauvaise réponse !");
    }

    setTimeout(() => {
      setShowCorrection(false);
      setHasAnswered(false);
      onEndTurn();
    }, 2000);
  };

  const startQuestion = async () => {
    await loadManager();
    if (category || category === Number(Category.Centre)) {
      await fetchNextQuestionByCategorie(category);
    } else {
        console.error("Aucune catégorie sélectionnée");
      await fetchNextQuestion();
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

  const isStepCategory = !readyForQuestion && category === null;
  const isStepConfirmation = !readyForQuestion && showCategory && category !== null;
  const isStepQuestion = readyForQuestion && showQuestionCard && currentQuestion;
  const isStepLoading = readyForQuestion && showQuestionCard && !currentQuestion;
  const isStepCorrection = showCorrection;

  const fadeSlideVariant = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
   };
   return (
    <AnimatePresence mode="wait">
        {!readyForQuestion && category === null && (
        <motion.div
            key="carousel"
            {...fadeSlideVariant}
            className="w-full flex justify-center"
        >
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
            className="w-full flex justify-center p-4"
        >
            <div className="flex flex-col items-center gap-4">
            <CategoryCard
                name={categoryData[category].name}
                imageUrl={categoryData[category].imageUrl}
                isSelected={true}
                onClick={() => {}}
                large={true}
            />
            <button className="btn btn-primary" onClick={startQuestion}>
                Commencer la question
            </button>
            </div>
        </motion.div>
        )}

        {readyForQuestion && showQuestionCard && currentQuestion && (
        <motion.div
            key="question-card"
            {...fadeSlideVariant}
            className="w-full flex justify-center items-center flex-col gap-6"
        >
            {isMobile ? (
            <TimerCircle key={questionKey} duration={TIMER_DURATION} timeLeft={timeLeft} />
            ) : (
            <TimerBar key={questionKey} duration={TIMER_DURATION} timeLeft={timeLeft} />
            )}
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

        {showCorrection && (
        <motion.div
            key="correction"
            {...fadeSlideVariant}
            className="text-center mt-4"
        >
            {lastAnswerCorrect ? (
            <p className="text-green-600 font-semibold text-lg">Bonne réponse ! 🎉</p>
            ) : (
            <p className="text-red-600 font-semibold text-lg">
                Mauvaise réponse ❌<br />
                {currentQuestion?.correction && (
                <span className="text-gray-800">
                    Bonne réponse : {currentQuestion.correction}
                </span>
                )}
            </p>
            )}
        </motion.div>
        )}
    </AnimatePresence>
    );
}
