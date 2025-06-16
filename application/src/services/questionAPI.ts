import http from "./http";

export const getPaginatedQuestions = async (question_number: number, page: number) => {
  const params: any = { question_number, page };
  return await http.get("/question/paginated", { params });
};


export const getAllQuestions = async () => {
  return await http.get("/question/questions",);
};