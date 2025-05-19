import http from './http';

export const getUserInformation = (email: string) => {
  return http.post('/user/me');
};