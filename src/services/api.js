import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// Auth
export const signup = (userData) => API.post('/auth/signup', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const getRewards = (email) => API.get(`/auth/rewards/${email}`);

// Transactions
export const getTransactions = () => API.get('/transactions');
export const addTransaction = (transactionData) => API.post('/transactions', transactionData);
export const updateTransaction = (transactionData) => API.put('/transactions', transactionData);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// Goals
export const getGoals = () => API.get('/goals');
export const addGoal = (goalData) => API.post('/goals', goalData);
export const updateGoal = (goalData) => API.put('/goals', goalData);
