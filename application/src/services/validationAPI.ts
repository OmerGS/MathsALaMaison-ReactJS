import http from "./http";

export const askValidation = async (identifier: string) => {     
    const response = await http.post("/validation/ask-code", { email: identifier });
    return response;
}

export const validateCode = async (identifier: string, code: string) => {
    const response = await http.post("/validation/check-code", { email: identifier, code });
    return response;
}