"use client";

import React, { useEffect, useState, useCallback } from "react";
import BackButton from "@/components/ui/BackButton";
import { Question } from "@/Type/Question";
import { handleGetAllQuestion } from "./getAllQuestions"; 
import "../../globals.css";

export default function TrainingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const questions = await handleGetAllQuestion();
      if (questions && questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setCurrentQuestion(questions[randomIndex]);
        
      } else {
        setCurrentQuestion(null);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la question:", error);
      setCurrentQuestion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  return (
    <div className="training-container flex flex-col items-center justify-center h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <BackButton />
      
      {loading && <p className="text-white text-lg">Chargement...</p>}

      {!loading && currentQuestion && (
        <div className="question-card bg-white rounded-lg p-6 shadow-md w-full max-w-lg mt-8">
          <h2 className="text-2xl font-bold mb-4">Question :</h2>
          <p className="text-gray-800 text-lg">{currentQuestion.question}</p>
        </div>
      )}

      {!loading && !currentQuestion && (
        <p className="text-white text-lg mt-8">Aucune question disponible.</p>
      )}

      <button
        onClick={loadQuestion}
        className="btn-primary mt-8 px-6 py-3 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Charger une nouvelle question
      </button>
    </div>
  );
}
