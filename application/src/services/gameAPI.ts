import http from "./http";

export const addPoint = async () => {
    const response = await http.post('/game/finish');
    return response.data;
};