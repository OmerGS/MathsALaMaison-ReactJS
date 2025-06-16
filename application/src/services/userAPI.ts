import http from './http';

export const getUserInformation = () => {
  return http.post('/user/me');
};

export const getUserIp = (email: string) => {
  return http.post('/user/ip', { email: email });
};

export const updateProfilePicture = (idPicture: number) => {
  return http.post('/user/updatePicture', {idPicture: idPicture})
}

