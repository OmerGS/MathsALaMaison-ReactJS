import http from './http';

export const login = (email: string, hashedPassword: string) => {
  return http.post('/auth/login', { email: email, password: hashedPassword });
};

export const register = (pseudo: string, email: string, password: string) => {
  return http.post('/auth/register', { pseudo, email, password });
};

export const logoutUser = async () => {
  const response = await http.post('/auth/logout');
  return response;
}