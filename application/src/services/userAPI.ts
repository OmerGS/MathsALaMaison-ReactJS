import http from './http';

export const checkUserAccess = async () => {
  return (await http.get('/user/check-access'));
}

export const getUserInformation = () => {
  return http.post('/user/me');
};

export const getUserIp = () => {
  return http.post('/user/ip');
};

export const getLeaderBoardUser = async (sortBy: string) => {
  const params: any = {sortBy};
  return await http.get("/user/users", {
    params,
  });
};

export const updateProfilePicture = (idPicture: number) => {
  return http.post('/user/updatePicture', {idPicture: idPicture})
}

export const updatePassword = (oldPassword: string, newPassword: string) => {
  return http.post('/user/update/password', {oldPassword, newPassword})
}

export const updateEmailAsk = (password: string, newEmail: string) => {
  return http.post('/user/update/mail/ask', {password, newEmail})
}

export const updateEmailCheck = (code: string) => {
  return http.post('/user/update/mail/validate', { code });
}

export const updatePseudoAsk = (password: string, newPseudo: string) => {
  return http.post('/user/update/pseudo/ask', {password, newPseudo});
} 

export const updatePseudoCheck = (code: string) => {
  return http.post('/user/update/pseudo/validate', { code });
}