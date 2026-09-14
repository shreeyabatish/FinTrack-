import React from "react";
import GoalCard from "../components/GoalCard";

function Goals() {
  return (
    <div className="goals-page">
      <h2 className="goals-title">My Goals</h2>
      {/* Added a simple subtitle for clarity */}
      <p className="goals-subtitle">Keep track of your savings progress</p>
      <div className="goals-container">
        <GoalCard goalName="Emergency Fund" saved={25000} target={50000} />
        <GoalCard goalName="Vacation Fund" saved={10000} target={20000} />
      </div>
    </div>
  );
}

export default Goals;
