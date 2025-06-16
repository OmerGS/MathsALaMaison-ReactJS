import http from './http';

export const getSaltByIdentifier = (email: string) => {
  return http.post('/user/getSaltByIdentifier', { email: email });
};

export const login = (email: string, hashedPassword: string) => {
  return http.post('/auth/login', { email: email, password: hashedPassword });
};

export const register = (pseudo: string, email: string, passworđ: string, salt: string) => {
  return http.post('/auth/register', { pseudo: pseudo, email: email, password: passworđ, salt: salt });
};