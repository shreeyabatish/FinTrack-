import React from "react";

function BudgetCard({ category, spent, budget }) {
  const percent = Math.round((spent / budget) * 100);

  // Dynamic color based on spending percentage
  let barColor = "green";
  if (percent >= 90) {
    barColor = "red";
  } else if (percent >= 70) {
    barColor = "orange";
  }

  return (
    <div>
      <h3>{category}</h3>
      <p>₹{spent} / ₹{budget}</p>
      <div style={{ background: "#ddd", width: "100%", height: "10px" }}>
        <div
          style={{
            background: barColor,
            width: `${percent}%`,
            height: "10px",
            transition: "width 0.3s ease" // 👈 added smooth animation
          }}
        ></div>
      </div>
      <p>{percent}%</p>
    </div>
  );
}

export default BudgetCard;
