"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import QuestionCard from "@/components/ui/QuestionCard";
import { handleGetpaginationQuestion } from "./getQuestion";
import { Question } from "@/Type/Question";
import "../../globals.css";

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const QUESTIONS_PER_PAGE = 50;

  const isFetchingRef = useRef(false);

  const loadQuestions = useCallback(
    async (currentPage: number) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const newQuestions = await handleGetpaginationQuestion(
          QUESTIONS_PER_PAGE,
          currentPage
        );

        if (newQuestions && newQuestions.length > 0) {
          setQuestions(newQuestions); // Remplace la liste, pas d’accumulation
          setHasMore(newQuestions.length === QUESTIONS_PER_PAGE); // S’il y a moins que QUESTIONS_PER_PAGE, plus de pages
          setPage(currentPage);
        } else {
          setHasMore(false);
          setQuestions([]); // aucune question sur cette page
        }
      } catch (error) {
        console.error("Erreur lors du chargement des questions :", error);
        setHasMore(false);
      }

      setIsLoading(false);
      isFetchingRef.current = false;
    },
    []
  );

  // Chargement initial ou changement de page
  useEffect(() => {
    loadQuestions(page);
  }, [page, loadQuestions]);

  // Gestion des clics sur boutons Précédent / Suivant
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (hasMore && !isLoading) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCF9] flex flex-col items-center pt-20 pb-10">
      <BackButton />

      {questions.length === 0 && !isLoading && (
        <p className="text-gray-400 mt-10">Aucune question chargée</p>
      )}

      <div className="w-full max-w-4xl">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}

        {isLoading && (
          <p className="text-center text-gray-500 mt-4">Chargement...</p>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={goToPreviousPage}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Précédent
          </button>

          <span className="self-center">Page {page}</span>

          <button
            onClick={goToNextPage}
            disabled={!hasMore || isLoading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
