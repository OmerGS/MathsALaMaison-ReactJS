import { getAllQuestions } from "@/services/questionAPI";
import { Question } from "@/Type/Question";

export async function handleGetAllQuestion(): Promise<Question[] | null> {
  try {
    let response = await getAllQuestions();
    if (response.status !== 200) {
      console.error("Erreur lors de la récupération des questions :", response.statusText);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des questions :", error);
    return null;
  }
}
