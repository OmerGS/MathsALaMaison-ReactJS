import http from './http';

export const checkAdminAccess = async () => {
  return (await http.get('/admin/check-access'));
}

export const getNonPremiumUser = async () => {
    const response = await http.get('/admin/getNonPremiumUser');
    return response.data; 
};

export const getAllUsers = async (page = 1, searchTerm = "", premiumFilter: "all" | "premium" | "nonpremium" = "all" ) => {
  const params: any = { page };

  if (searchTerm.trim() !== "") {
    params.search = searchTerm.trim();
  }

  if (premiumFilter !== "all") {
    params.premium = premiumFilter === "premium" ? "true" : "false";
  }

  const response = await http.get("/admin/getAllUsers", {
    params,
  });
  
  return response.data;
};

export const approveUser = async (id: number, email: string, pseudo: string) => {
    const response = await http.post('/admin/approveUser', { id, email, pseudo });
    return response.data;
};

export const rejectUser = async (id: number, email: string, pseudo: string) => {
    const response = await http.post('/admin/rejectUser', { id, email, pseudo });
    return response.data;
};

export const getUserPerPage = async () => {
    const response = await http.get('/admin/settings/users_per_page');
    return response.data; 
}

export const updateUserPerPageNumber = async (page: number) => {
    const response = await http.post('/admin/settings/users_per_page', { users_per_page: page });
    return response.data; 
}

export const getAllQuestion = async (page = 1) => {
  const params = { page };

  const response = await http.get("/admin/getAllQuestions", { params });
  return response.data;
};

export const getQuestionPerPage = async () => {
    const response = await http.get('/admin/settings/questions_per_page');
    return response.data; 
}

export const updateQuestionPerPageNumber = async (page: number) => {
    const response = await http.post('/admin/settings/questions_per_page', { questions_per_page: page });
    return response.data; 
}

export const addNewQuestion = async ({
  typeQuestion,
  question,
  typeReponse,
  reponse,
  correction,
  image_data,
}: {
  typeQuestion: string;
  question: string;
  typeReponse: string;
  reponse: string;
  correction?: string;
  image_data?: string | null;
}) => {
  const response = await http.post('/admin/question', {
    typeQuestion,
    question,
    typeReponse,
    reponse,
    correction: correction || '',
    image_data: image_data || null,
  });

  return response.data;
};

export const updatePremiumState = async (email: string, newPremiumState: boolean) => {
    const response = await http.post('/admin/update-premium', { email, newPremiumState });
    return response.data; 
}

export const getStatistics = async () => {
    const response = await http.get('/stats/server-stats');
    return response.data; 
}

export const sendEmailToEveryone = async (subject: string, content: string) => {
    const response = await http.post('/admin/send-email', { subject, content });
    return response.data; 
}