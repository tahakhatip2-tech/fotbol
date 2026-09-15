import api from './axios';

export const getMatches = async () => {
  const response = await api.get('/matches');
  return response.data;
};

export const placeBet = async (betData: any) => {
  const response = await api.post('/bets', betData);
  return response.data;
};
