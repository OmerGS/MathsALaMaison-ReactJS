import axios from 'axios';
import { API_KEY, BACKEND_API } from '../config';

const http = axios.create({
  baseURL: BACKEND_API.baseURL,
  headers: {
    'x-api-key': API_KEY.API_KEY,
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

http.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default http;