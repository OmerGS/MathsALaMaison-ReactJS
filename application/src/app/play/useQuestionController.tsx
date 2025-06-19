import { useState, useCallback, useRef } from 'react';
import QuestionManager from './QuestionManager';
import Question from '@/Type/model/Question';
import Category from '@/Type/Category';

type UseQuestionControllerReturn = {
  currentQuestion: Question | null;
  loading: boolean;
  possiblereponses: string[];
  loadManager: () => Promise<void>;
  fetchNextQuestion: () => Promise<void>;
  fetchNextQuestionByCategorie: (category: Category) => Promise<void>;
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

  const fetchNextQuestionByCategorie = useCallback(async (category: Category) => {
    setLoading(true);
    try {
      if (!controllerRef.current) {
        controllerRef.current = new QuestionManager();
      }
      if (!category) {
        throw new Error('Aucune catégorie sélectionnée');
      }
      console.log('Chargement de la question pour la catégorie :', category);
      const question = await controllerRef.current.fetchRandomQuestionByCategory(category);
      console.log('Question chargée :', question);
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
    console.log('Checking multiple text responses:', reponses);
    if (!controllerRef.current) return false;
    return controllerRef.current.checkMultipleTextreponses(reponses);
  }, []);

  return {
    currentQuestion,
    loading,
    possiblereponses: getPossiblereponses(),
    loadManager,
    fetchNextQuestion,
    fetchNextQuestionByCategorie,
    checkSelectionreponse,
    checkTextreponse,
    checkMultipleTextreponses,
  };
}