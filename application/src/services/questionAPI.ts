import Category from "@/Type/Category";
import http from "./http";

export const fetchQuestion = async () => {
    const response = await http.get('/question/questions');
    return response.data;
};

export const getRandomQuestion = async () => {
    const response = await http.get('/question/random');
    return response.data;
};

export const getRandomCategoryQuestion = async (category: Category) => {
  const response = await http.get('/question/random/category', { params: { category } });
  return response.data;
};
export const getPaginatedQuestions = async (question_number: number, page: number) => {
  const params: any = { question_number, page };
  return await http.get("/question/paginated", { params });
};


export const getAllQuestions = async () => {
  return await http.get("/question/questions",);
};