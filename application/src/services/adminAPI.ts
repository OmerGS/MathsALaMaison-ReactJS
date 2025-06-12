import http from './http';

export const checkAdminAccess = async () => {
  return (await http.get('/admin/check-access'));
}

export const getNonPremiumUser = async () => {
    const response = await http.get('/admin/getNonPremiumUser');
    return response.data; 
};

export const getAllUsers = async (page = 1, limit = 20) => {
  const response = await http.get('/admin/getAllUsers', {
    params: { page, limit }
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

/*export const getAllQuestion = () => {
    return http.get('/admin/getAllQuestion');
};

export const createQuestion = (question: Question) => {
    return http.post('/admin/createQuestion', question);
};
*/