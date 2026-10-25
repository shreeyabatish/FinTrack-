
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import * as api from "../services/api";

const FinanceContext = createContext(null);

const EMPTY_REWARDS = {
  points: 0,
  xp: 0,
  level: 1,
};

function getStoredUser() {
  try {
    const savedUser = localStorage.getItem("finstack_user");
    const activeEmail = localStorage.getItem("activeUserEmail");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    if (activeEmail) {
      return { email: activeEmail };
    }

    return null;
  } catch (error) {
    console.error("Could not restore saved user:", error);
    return null;
  }
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export function FinanceProvider({ children }) {
  // ========================================
  // AUTHENTICATION STATE
  // ========================================

  const [user, setUser] = useState(getStoredUser);

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  const isLoggedIn = Boolean(token);

  // ========================================
  // APPLICATION DATA
  // ========================================

  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [rewards, setRewards] = useState(EMPTY_REWARDS);

  // ========================================
  // SAVE USER SESSION
  // ========================================

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("finstack_user", JSON.stringify(user));

      if (user.email) {
        localStorage.setItem("activeUserEmail", user.email);
      }
    } else {
      localStorage.removeItem("finstack_user");
      localStorage.removeItem("activeUserEmail");
    }
  }, [user]);

  // ========================================
  // FETCH TRANSACTIONS
  // ========================================

  const fetchTransactions = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setTransactions([]);
      return;
    }

    try {
      const response = await api.getTransactions();
      const data = response.data;

      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        getErrorMessage(error, "Unable to load transactions")
      );

      throw error;
    }
  }, []);

  // ========================================
  // FETCH BUDGETS
  // ========================================

  const fetchBudgets = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setBudgets([]);
      return;
    }

    try {
      const response = await api.getBudgets();
      const data = response.data;

      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Error fetching budgets:",
        getErrorMessage(error, "Unable to load budgets")
      );

      throw error;
    }
  }, []);

  // ========================================
  // FETCH GOALS
  // ========================================

  const fetchGoals = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setGoals([]);
      return;
    }

    try {
      const response = await api.getGoals();
      const data = response.data;

      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Error fetching goals:",
        getErrorMessage(error, "Unable to load goals")
      );

      throw error;
    }
  }, []);

  // ========================================
  // FETCH REWARDS
  // ========================================

  const fetchRewards = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setRewards(EMPTY_REWARDS);
      return;
    }

    try {
      const response = await api.getRewards();
      const data = response.data || {};

      setRewards((previous) => ({
        ...previous,
        ...data,
        points: data.points ?? previous.points ?? 0,
        xp: data.xp ?? previous.xp ?? 0,
        level: data.level ?? previous.level ?? 1,
      }));
    } catch (error) {
      console.error(
        "Error fetching rewards:",
        getErrorMessage(error, "Unable to load rewards")
      );

      throw error;
    }
  }, []);

  // ========================================
  // RELOAD SAVED DATA AFTER LOGIN / REFRESH
  // ========================================

  useEffect(() => {
    if (!token) {
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setRewards(EMPTY_REWARDS);
      return;
    }

    let cancelled = false;

    async function loadSavedData() {
      const results = await Promise.allSettled([
        fetchTransactions(),
        fetchBudgets(),
        fetchGoals(),
        fetchRewards(),
      ]);

      if (cancelled) return;

      const names = ["transactions", "budgets", "goals", "rewards"];

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Failed to load ${names[index]}. Check authentication and the backend.`,
            result.reason
          );
        }
      });
    }

    loadSavedData();

    return () => {
      cancelled = true;
    };
  }, [
    token,
    fetchTransactions,
    fetchBudgets,
    fetchGoals,
    fetchRewards,
  ]);

  // ========================================
  // SIGN UP
  // ========================================

  const signupUser = async (userData) => {
    try {
      const response = await api.signup(userData);
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error(
        getErrorMessage(error, "Registration failed")
      );
    }
  };

  // ========================================
  // LOGIN
  // ========================================

  const loginUser = async (userData) => {
    try {
      const response = await api.login(userData);
      const data = response.data || {};

      const receivedToken = data.token || data.accessToken;

      if (!receivedToken) {
        throw new Error(
          "Login succeeded without a token. Check the backend login response."
        );
      }

      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);

      const loggedInUser = {
        ...(data.user || {}),
        email:
          data.user?.email ||
          data.email ||
          userData.email,
      };

      setUser(loggedInUser);

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(
        getErrorMessage(error, "Login failed")
      );
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("finstack_user");
    localStorage.removeItem("activeUserEmail");

    setToken("");
    setUser(null);

    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setRewards(EMPTY_REWARDS);
  };

  // ========================================
  // UPDATE PROFILE
  // ========================================

  const updateProfile = async (profileData) => {
    const updatedUser = {
      ...(user || {}),
      ...profileData,
    };

    // Preserve the existing localStorage-based profile editing.
    setUser(updatedUser);

    return updatedUser;
  };

  // ========================================
  // TRANSACTION CRUD
  // ========================================

  const addTransaction = async (transactionData) => {
    try {
      const response = await api.addTransaction(transactionData);

      await fetchTransactions();
      await fetchRewards();

      return response.data;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw new Error(
        getErrorMessage(error, "Could not add transaction")
      );
    }
  };

  const updateTransaction = async (transactionData) => {
    try {
      const id = transactionData.id || transactionData._id;

      if (!id) {
        throw new Error("Transaction ID is missing.");
      }

      const response = await api.updateTransaction({
        ...transactionData,
        id,
      });

      await fetchTransactions();

      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw new Error(
        getErrorMessage(error, "Could not update transaction")
      );
    }
  };

  const deleteTransaction = async (id) => {
    try {
      if (!id) {
        throw new Error("Transaction ID is missing.");
      }

      const response = await api.deleteTransaction(id);

      await fetchTransactions();

      return response.data;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw new Error(
        getErrorMessage(error, "Could not delete transaction")
      );
    }
  };

  // ========================================
  // GOAL CRUD
  // ========================================

  const addGoal = async (goalData) => {
    try {
      const response = await api.addGoal(goalData);

      await fetchGoals();
      await fetchRewards();

      return response.data;
    } catch (error) {
      console.error("Error adding goal:", error);
      throw new Error(
        getErrorMessage(error, "Could not add goal")
      );
    }
  };

  const updateGoal = async (goalData) => {
    try {
      const id = goalData.id || goalData._id;

      if (!id) {
        throw new Error("Goal ID is missing.");
      }

      const response = await api.updateGoal({
        ...goalData,
        id,
      });

      await fetchGoals();
      await fetchRewards();

      return response.data;
    } catch (error) {
      console.error("Error updating goal:", error);
      throw new Error(
        getErrorMessage(error, "Could not update goal")
      );
    }
  };

  const deleteGoal = async (id) => {
    try {
      if (!id) {
        throw new Error("Goal ID is missing.");
      }

      const response = await api.deleteGoal(id);

      await fetchGoals();

      return response.data;
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw new Error(
        getErrorMessage(error, "Could not delete goal")
      );
    }
  };

  // ========================================
  // BUDGET CRUD
  // ========================================

  const addBudget = async (budgetData) => {
    try {
      const response = await api.addBudget(budgetData);

      await fetchBudgets();
      await fetchRewards();

      return response.data;
    } catch (error) {
      console.error("Error adding budget:", error);
      throw new Error(
        getErrorMessage(error, "Could not add budget")
      );
    }
  };

  const updateBudget = async (budgetData) => {
    try {
      const id = budgetData.id || budgetData._id;

      if (!id) {
        throw new Error("Budget ID is missing.");
      }

      const response = await api.updateBudget({
        ...budgetData,
        id,
      });

      await fetchBudgets();

      return response.data;
    } catch (error) {
      console.error("Error updating budget:", error);
      throw new Error(
        getErrorMessage(error, "Could not update budget")
      );
    }
  };

  const deleteBudget = async (id) => {
    try {
      if (!id) {
        throw new Error("Budget ID is missing.");
      }

      const response = await api.deleteBudget(id);

      await fetchBudgets();

      return response.data;
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw new Error(
        getErrorMessage(error, "Could not delete budget")
      );
    }
  };

  // ========================================
  // DERIVED TRANSACTION TOTALS
  // ========================================

  const totals = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (sum, transaction) => sum + Number(transaction.amount || 0),
        0
      );

    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (sum, transaction) => sum + Number(transaction.amount || 0),
        0
      );

    return {
      income,
      expenses,
      balance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
    };
  }, [transactions]);

  // ========================================
  // SPENDING BY CATEGORY
  // ========================================

  const spentByCategory = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((result, transaction) => {
        const category = transaction.category || "Other";

        result[category] =
          (result[category] || 0) +
          Number(transaction.amount || 0);

        return result;
      }, {});
  }, [transactions]);

  // ========================================
  // PROVIDER
  // ========================================

  const value = {
    user,
    token,
    isLoggedIn,

    signupUser,
    loginUser,
    logoutUser,
    updateProfile,

    transactions,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,

    budgets,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,

    goals,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,

    rewards,
    fetchRewards,

    totals,
    spentByCategory,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error(
      "useFinance must be used inside a FinanceProvider"
    );
  }

  return context;
}
