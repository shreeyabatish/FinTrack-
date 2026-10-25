import axios from 'axios';

// ✅ Base URL already includes /api
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// ✅ Interceptor attaches JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// =========================
// Auth
// =========================
export const signup = (userData) =>
  API.post('/auth/signup', userData);

export const login = (userData) =>
  API.post('/auth/login', userData);

export const getProfile = () =>
  API.get('/auth/profile');

export const updateProfile = (profileData) =>
  API.patch('/auth/profile', profileData);

export const getRewards = () =>
  API.get('/auth/rewards');

// =========================
// Transactions
// =========================
export const getTransactions = () => API.get('/transactions');
export const addTransaction = (transactionData) => API.post('/transactions', transactionData);
export const updateTransaction = (transactionData) => API.put(`/transactions/${transactionData.id}`, transactionData);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// =========================
// Goals
// =========================
export const getGoals = () => API.get('/goals');
export const addGoal = (goalData) => API.post('/goals', goalData);
export const updateGoal = (goalData) => API.put(`/goals/${goalData.id}`, goalData);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

// =========================
// Budgets
// =========================
export const getBudgets = () => API.get('/budgets');
export const addBudget = (budgetData) => API.post('/budgets', budgetData);
export const updateBudget = (budgetData) => API.put(`/budgets/${budgetData.id}`, budgetData);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);
