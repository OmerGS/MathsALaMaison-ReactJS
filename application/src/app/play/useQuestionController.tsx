import { useState, useCallback, useRef } from 'react';
import QuestionManager from './QuestionManager';
import Question from '@/Type/model/Question';

type UseQuestionControllerReturn = {
  currentQuestion: Question | null;
  loading: boolean;
  possiblereponses: string[];
  loadManager: () => Promise<void>;
  fetchNextQuestion: () => Promise<void>;
  checkSelectionreponse: (reponse: string) => boolean;
  checkTextreponse: (reponse: string) => boolean;
  checkMultipleTextreponses: (reponses: string[]) => boolean;
};

export default function useQuestionController(): UseQuestionControllerReturn {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<QuestionManager | null>(null);

  const loadManager = useCallback(async () => {
    if (!controllerRef.current) {
      controllerRef.current = new QuestionManager();
    }
  }, []);

  const fetchNextQuestion = useCallback(async () => {
    setLoading(true);
    try {
      if (!controllerRef.current) {
        controllerRef.current = new QuestionManager();
      }
      const question = await controllerRef.current.fetchRandomQuestion();
      setCurrentQuestion(question);
    } catch (error) {
      console.error('Erreur lors du chargement de la question :', error);
      setCurrentQuestion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPossiblereponses = useCallback(() => {
    return controllerRef.current?.getPossiblereponses() || [];
  }, []);

  const checkSelectionreponse = useCallback((reponse: string) => {
    if (!controllerRef.current) return false;
    return controllerRef.current.checkSelectionreponse(reponse);
  }, []);

  const checkTextreponse = useCallback((reponse: string) => {
    if (!controllerRef.current) return false;
    return controllerRef.current.checkTextreponse(reponse);
  }, []);

  const checkMultipleTextreponses = useCallback((reponses: string[]) => {
    if (!controllerRef.current) return false;
    return controllerRef.current.checkMultipleTextreponses(reponses);
  }, []);

  return {
    currentQuestion,
    loading,
    possiblereponses: getPossiblereponses(),
    loadManager,
    fetchNextQuestion,
    checkSelectionreponse,
    checkTextreponse,
    checkMultipleTextreponses,
  };
}