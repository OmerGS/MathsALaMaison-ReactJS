import { getPaginatedQuestions } from "@/services/questionAPI";
import { Question } from "@/Type/Question";

export async function handleGetpaginationQuestion(question_number: number, page: number): Promise<Question[] | null> {
  try {
    let response = await getPaginatedQuestions(question_number, page);
    console.log(response);
    if (response.status !== 200) {
      console.error("Erreur lors de la récupération des questions :", response.statusText);
      return null;
    }
    return response.data.questions;
  } catch (error) {
    console.error("Erreur lors de la récupération des questions :", error);
    return null;
  }
}
