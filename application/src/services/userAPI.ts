import http from './http';

export const getUserInformation = () => {
  return http.post('/user/me');
};

export const getUserIp = () => {
  return http.post('/user/ip');
};

export const updateProfilePicture = (idPicture: number) => {
  return http.post('/user/updatePicture', {idPicture: idPicture})
}

export const getLeaderBoardUser = async (sortBy: string) => {
  const params: any = {sortBy};
  return await http.get("/user/users", {
    params,
  });
};

