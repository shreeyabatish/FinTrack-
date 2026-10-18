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
  /* =========================
   TRANSACTIONS (local only for now)
========================= */
const addTransaction = (transaction) => {
  setTransactions((current) => [
    ...current,
    { ...transaction, id: Date.now(), amount: Number(transaction.amount) }
  ]);
};

const updateTransaction = (updatedTransaction) => {
  setTransactions((current) =>
    current.map((t) =>
      t.id === updatedTransaction.id ? { ...t, ...updatedTransaction } : t
    )
  );
};

const deleteTransaction = (id) => {
  setTransactions((current) => current.filter((t) => t.id !== id));
};


  /* =========================
     GOALS
  ========================= */
 const fetchGoals = () => {
  // For local goals, just return current state
  return goals;
};

const addGoal = (goal) => {
  setGoals((current) => [
    ...current,
    { ...goal, id: Date.now() }
  ]);
};

const updateGoal = (updatedGoal) => {
  setGoals((current) =>
    current.map((g) =>
      g.id === updatedGoal.id ? { ...g, ...updatedGoal } : g
    )
  );
};

const deleteGoal = (id) => {
  setGoals((current) => current.filter((g) => g.id !== id));
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
  transactions, addTransaction, updateTransaction, deleteTransaction,
  totals, spentByCategory,
  goals, addGoal, updateGoal, deleteGoal,
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
