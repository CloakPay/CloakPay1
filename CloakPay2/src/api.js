import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export const getPoolBalance = async () => {
  const { data } = await api.get('/pool-balance');
  return data;
};

export const createPayroll = async (entries) => {
  const { data } = await api.post('/create-payroll', { entries });
  return data;
};

export const getVoucher = async (id) => {
  const { data } = await api.get(`/voucher/${id}`);
  return data;
};

export default api;
