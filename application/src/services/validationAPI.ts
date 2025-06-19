import http from "./http";

export const askValidation = async (identifier: string) => {     
    const response = await http.post("/validation/ask-code", { email: identifier });
    return response;
}

export const validateCode = async (identifier: string, code: string) => {
    const response = await http.post("/validation/check-code", { email: identifier, code });
    return response;
}

export const resetPassword = async (identifier: string, token: string, password: string) => {
    const response = await http.post("/validation/reset-password", { email: identifier, token, password });
    return response;
}

export const askMailCode = () => {
  return http.post('/validation/logged/ask-code');
}

export const checkMailCode = (code: string) => {
  return http.post('/validation/logged/check-code', {code});
}