import { AskPayload, UpdateStep, UpdateType, ValidatePayload } from '@/Type/UpdateUserInformation';
import http from './http';

// --- USER ACCESS & INFO ---

export const checkUserAccess = async () => {
  return (await http.get('/user/check-access'));
}

export const getUserInformation = () => {
  return http.post('/user/me');
};

export const getUserIp = () => {
  return http.post('/user/ip');
};

// --- LEADERBOARD ---

export const getLeaderBoardUser = async (sortBy: string) => {
  const params: any = {sortBy};
  return await http.get("/user/users", {
    params,
  });
};

// --- USER INFO UPDATE (email, pseudo) ---

export const updateProfilePicture = (idPicture: number) => {
  return http.post('/user/updatePicture', {idPicture: idPicture})
}

export const updatePassword = (oldPassword: string, newPassword: string) => {
  return http.post('/user/update/password', {oldPassword, newPassword})
}

export const updateUserInfo = (type: UpdateType, step: UpdateStep, payload: AskPayload | ValidatePayload) => {
  let endpoint = `/user/update/${type}/${step}`;

  if (step === 'ask') {
    return http.post(endpoint, {
      password: (payload as AskPayload).password,
      ...(type === 'mail' ? { newEmail: (payload as AskPayload).newValue } : { newPseudo: (payload as AskPayload).newValue }),
    });
  } else {
    return http.post(endpoint, { code: (payload as ValidatePayload).code });
  }
};