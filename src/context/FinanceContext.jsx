import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

const FinanceContext = createContext();

const initialTransactions = [
    {
        id: 1,
        title: "Salary",
        category: "Income",
        amount: 50000,
        type: "income",
        date: "2026-09-01",
    },
    {
        id: 2,
        title: "Rent",
        category: "Housing",
        amount: 15000,
        type: "expense",
        date: "2026-09-02",
    },
    {
        id: 3,
        title: "Groceries",
        category: "Food",
        amount: 4500,
        type: "expense",
        date: "2026-09-05",
    },
    {
        id: 4,
        title: "Freelance",
        category: "Income",
        amount: 12000,
        type: "income",
        date: "2026-09-08",
    },
    {
        id: 5,
        title: "Shopping",
        category: "Shopping",
        amount: 2500,
        type: "expense",
        date: "2026-09-10",
    },
];

const initialBudgets = [
    {
        id: 1,
        category: "Food",
        amount: 5000,
    },
    {
        id: 2,
        category: "Travel",
        amount: 3000,
    },
    {
        id: 3,
        category: "Shopping",
        amount: 3000,
    },
];

const initialGoals = [
    {
        id: 1,
        name: "Emergency Fund",
        target: 50000,
        saved: 25000,
    },
    {
        id: 2,
        name: "Vacation Fund",
        target: 20000,
        saved: 10000,
    },
];

export function FinanceProvider({ children }) {

    /* =========================
       TRANSACTIONS
    ========================= */

    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem("fintrack_transactions");

        return saved
            ? JSON.parse(saved)
            : initialTransactions;
    });

    useEffect(() => {
        localStorage.setItem(
            "fintrack_transactions",
            JSON.stringify(transactions)
        );
    }, [transactions]);

    const addTransaction = (transaction) => {
        setTransactions((current) => [
            ...current,
            {
                ...transaction,
                id: Date.now(),
                amount: Number(transaction.amount),
            },
        ]);
    };

    const deleteTransaction = (id) => {
        setTransactions((current) =>
            current.filter(
                (transaction) => transaction.id !== id
            )
        );
    };


    /* =========================
       TOTALS
    ========================= */

    const totals = useMemo(() => {

        const income = transactions
            .filter((t) => t.type === "income")
            .reduce(
                (sum, t) => sum + Number(t.amount),
                0
            );

        const expense = transactions
            .filter((t) => t.type === "expense")
            .reduce(
                (sum, t) => sum + Number(t.amount),
                0
            );

        return {
            income,
            expense,
            balance: income - expense,
        };

    }, [transactions]);


    /* =========================
       SPENDING BY CATEGORY
    ========================= */

    const spentByCategory = useMemo(() => {

        const result = {};

        transactions
            .filter((t) => t.type === "expense")
            .forEach((t) => {

                if (!result[t.category]) {
                    result[t.category] = 0;
                }

                result[t.category] += Number(t.amount);
            });

        return result;

    }, [transactions]);


    /* =========================
       BUDGETS
    ========================= */

    const [budgets, setBudgets] = useState(() => {

    const saved = localStorage.getItem("fintrack_budgets");

    if (!saved) {
        return initialBudgets;
    }

    try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
            return parsed;
        }

        if (Array.isArray(parsed.budgets)) {
            return parsed.budgets;
        }

        return initialBudgets;

    } catch (error) {
        return initialBudgets;
    }

});

    useEffect(() => {

        localStorage.setItem(
            "fintrack_budgets",
            JSON.stringify(budgets)
        );

    }, [budgets]);


    const addBudget = (budget) => {

        setBudgets((current) => [
            ...current,
            {
                ...budget,
                id: Date.now(),
                amount: Number(budget.amount),
            },
        ]);

    };


    const deleteBudget = (id) => {

        setBudgets((current) =>
            current.filter(
                (budget) => budget.id !== id
            )
        );

    };


    /* =========================
       BUDGET DATA WITH ACTUAL
       SPENDING
    ========================= */

    const budgetData = useMemo(() => {

        return budgets.map((budget) => {

            const spent =
                spentByCategory[budget.category] || 0;

            const percentage =
                budget.amount > 0
                    ? Math.round(
                        (spent / budget.amount) * 100
                    )
                    : 0;

            return {
                ...budget,
                spent,
                percentage,
                remaining:
                    budget.amount - spent,
            };

        });

    }, [budgets, spentByCategory]);


    /* =========================
       GOALS
    ========================= */

    const [goals, setGoals] = useState(() => {

        const saved = localStorage.getItem(
            "fintrack_goals"
        );

        return saved
            ? JSON.parse(saved)
            : initialGoals;
    });

    useEffect(() => {

        localStorage.setItem(
            "fintrack_goals",
            JSON.stringify(goals)
        );

    }, [goals]);


    const addGoal = (goal) => {

        setGoals((current) => [
            ...current,
            {
                ...goal,
                id: Date.now(),
                target: Number(goal.target),
                saved: Number(goal.saved || 0),
            },
        ]);

    };


    const deleteGoal = (id) => {

        setGoals((current) =>
            current.filter(
                (goal) => goal.id !== id
            )
        );

    };


    const updateGoal = (id, saved) => {

        setGoals((current) =>
            current.map((goal) =>
                goal.id === id
                    ? {
                        ...goal,
                        saved: Number(saved),
                    }
                    : goal
            )
        );

    };


    /* =========================
       FINAL CONTEXT
    ========================= */

    return (
        <FinanceContext.Provider
            value={{

                /* Transactions */
                transactions,
                addTransaction,
                deleteTransaction,

                /* Financial totals */
                totals,
                spentByCategory,

                /* Budgets */
                budgets,
                budgetData,
                addBudget,
                deleteBudget,

                /* Goals */
                goals,
                addGoal,
                deleteGoal,
                updateGoal,

            }}
        >
            {children}
        </FinanceContext.Provider>
    );
}


export function useFinance() {
    return useContext(FinanceContext);
}