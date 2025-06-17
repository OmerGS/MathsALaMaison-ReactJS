"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import QuestionCard from '@/components/ui/QuestionCard';
import TimerCircle from '@/components/ui/TimerCircle';
import TimerBar from '@/components/ui/TimerBar';
import { TrainingEndgame } from '@/components/ui/TrainingEndgame';
import Loading from '@/components/ui/Loading';
import BackButton from '@/components/ui/BackButton';

import useIsMobile from '@/hooks/useIsMobile';
import useQuestionController from '../useQuestionController';

const TrainingScreen = () => {
  const router = useRouter();
  const {
    currentQuestion,
    loading,
    possiblereponses,
    loadManager,
    fetchNextQuestion,
    checkSelectionreponse,
    checkTextreponse,
    checkMultipleTextreponses,
  } = useQuestionController();

  const TIMER_DURATION = 45;
  const isMobile = useIsMobile();

  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [questionKey, setQuestionKey] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initialize = async () => {
      await loadManager();
      await fetchNextQuestion();
      setTimeLeft(TIMER_DURATION);
      setQuestionKey(k => k + 1);
      setCorrectAnswers(0);
      setTotalQuestions(0);
      setQuizFinished(false);
    };
    initialize();
  }, [loadManager, fetchNextQuestion]);

  useEffect(() => {
    if (loading || !currentQuestion || quizFinished) return;

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
  }, [timeLeft, loading, currentQuestion, quizFinished]);

  const nextQuestion = async () => {
    if (quizFinished) return;
    await fetchNextQuestion();
    setTimeLeft(TIMER_DURATION);
    setQuestionKey(k => k + 1);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setTotalQuestions(t => {
      const newTotal = t + 1;
      if (newTotal >= 10) {
        setQuizFinished(true);
      }
      return newTotal;
    });

    if (isCorrect) {
      setCorrectAnswers(c => c + 1);
      toast.success("Bonne réponse !");
    } else {
      toast.error("Mauvaise réponse !");
    }

    if (!quizFinished) {
      nextQuestion();
    }
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

  const handleRestart = () => {
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setQuizFinished(false);
    setTimeLeft(TIMER_DURATION);
    fetchNextQuestion();
    setQuestionKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-l font-sans from-custom to-custom py-10 px-4 flex flex-col items-center relative">
      <BackButton />

      {quizFinished ? (
        <TrainingEndgame
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          onRestart={handleRestart}
          onBack={() => router.back()}
        />
      ) : loading || !currentQuestion ? (
        <div className="mt-20">
          <Loading />
        </div>
      ) : (
        <>
          <div className="mb-4 text-lg font-semibold text-gray-700">
            Question : {totalQuestions} / 10
          </div>

          {isMobile ? (
            <TimerCircle
              key={questionKey}
              duration={TIMER_DURATION}
              timeLeft={timeLeft}
            />
          ) : (
            <TimerBar
              key={questionKey}
              duration={TIMER_DURATION}
              timeLeft={timeLeft}
            />
          )}

          <QuestionCard
            question={currentQuestion}
            possiblereponses={possiblereponses}
            onCheckSelection={handlereponseSelection}
            onCheckText={handleTextreponseSelection}
            onCheckMultipleText={handleMultipleTextreponse}
          />
        </>
      )}
    </div>
  );
};

export default TrainingScreen;