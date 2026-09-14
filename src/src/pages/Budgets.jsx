import React from "react";
import BudgetCard from "../components/BudgetCard";

function Budgets() {
  return (
    <div className="budgets-page">
      {/* Added a simple description for clarity */}
      <h2 className="budgets-title">Monthly Budget</h2>
      <p className="budgets-subtitle">Track your spending across categories</p>
      <div className="budgets-container">
        <BudgetCard category="Food" spent={4200} budget={5000} />
        <BudgetCard category="Travel" spent={1500} budget={3000} />
        <BudgetCard category="Shopping" spent={2800} budget={3000} />
      </div>
    </div>
  );
}

export default Budgets;
