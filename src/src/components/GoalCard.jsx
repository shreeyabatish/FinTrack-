import React from "react";

function GoalCard({ goalName, saved, target }) {
  const percent = Math.round((saved / target) * 100);
  const remaining = target - saved;

  // Dynamic color based on progress
  let barColor = "blue";
  if (percent >= 100) {
    barColor = "green";
  } else if (percent >= 70) {
    barColor = "orange";
  }

  return (
    <div className="goal-card">
      <h3>{goalName}</h3>
      <p>₹{saved} / ₹{target}</p>
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
      {remaining > 0 ? (
        <p>₹{remaining} remaining</p>
      ) : (
        <p style={{ color: "green" }}>Goal achieved!</p>
      )}
    </div>
  );
}

export default GoalCard;
