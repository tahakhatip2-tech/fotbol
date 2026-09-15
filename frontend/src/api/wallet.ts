import api from './axios';

export const getWallet = async () => {
  const response = await api.get('/wallet');
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get('/wallet/transactions');
  return response.data;
};
