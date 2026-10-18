import React, { createContext, useContext, useState, useMemo } from "react";
import * as api from "../services/api";   // ✅ central API service

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  /* =========================
     STATE
  ========================= */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]); // still local for now
  const [rewards, setRewards] = useState({ points: 0, xp: 0, level: 1 });

  /* =========================
     DERIVED TOTALS
  ========================= */
  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return { income, expense, balance: income - expense };
  }, [transactions]);

  const spentByCategory = useMemo(() => {
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      });
    return categoryTotals;
  }, [transactions]);

  /* =========================
     AUTH
  ========================= */
  const signupUser = async (formData) => {
    await api.signup(formData);
  };

  const loginUser = async (formData) => {
    const { data } = await api.login(formData);
    setToken(data.token);
    setUser({ email: formData.email });
    fetchRewards(formData.email);
  };

  /* =========================
     REWARDS
  ========================= */
  const fetchRewards = async (email) => {
    const { data } = await api.getRewards(email);
    setRewards(data);
  };

  /* =========================
     TRANSACTIONS
  ========================= */
  const fetchTransactions = async () => {
    const { data } = await api.getTransactions();
    setTransactions(data);
  };

  const addTransaction = async (transactionData) => {
    await api.addTransaction(transactionData);
    fetchTransactions();
    fetchRewards(transactionData.email);
  };

  const updateTransaction = async (transactionData) => {
    await api.updateTransaction(transactionData);
    fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await api.deleteTransaction(id);
    fetchTransactions();
  };

  /* =========================
     GOALS
  ========================= */
  const fetchGoals = async () => {
    const { data } = await api.getGoals();
    setGoals(data);
  };

  const addGoal = async (goalData) => {
    await api.addGoal(goalData);
    fetchGoals();
    fetchRewards(goalData.email);
  };

  const updateGoal = async (goalData) => {
    await api.updateGoal(goalData);
    fetchGoals();
  };

  // deleteGoal can be added once you implement backend route
  const deleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  /* =========================
     BUDGETS (local only for now)
  ========================= */
  const addBudget = (budget) => {
    setBudgets((current) => [
      ...current,
      { ...budget, id: Date.now(), amount: Number(budget.amount) },
    ]);
  };

  const updateBudget = (id, updatedBudget) => {
    setBudgets((current) =>
      current.map((b) =>
        b.id === id ? { ...b, ...updatedBudget, amount: Number(updatedBudget.amount) } : b
      )
    );
  };

  const deleteBudget = (id) => {
    setBudgets((current) => current.filter((b) => b.id !== id));
  };

  /* =========================
     PROVIDER
  ========================= */
  return (
    <FinanceContext.Provider
      value={{
        user, token,
        signupUser, loginUser,
        rewards, fetchRewards,
        transactions, fetchTransactions, addTransaction, updateTransaction, deleteTransaction,
        totals, spentByCategory,   // ✅ expose derived values
        goals, fetchGoals, addGoal, updateGoal, deleteGoal,
        budgets, addBudget, updateBudget, deleteBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
