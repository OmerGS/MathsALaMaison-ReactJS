import http from './http';

export const getUserInformation = () => {
  return http.post('/user/me');
};

export const getUserIp = () => {
  return http.post('/user/ip');
};