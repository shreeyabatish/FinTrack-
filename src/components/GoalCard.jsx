
function GoalCard({
  goalId,
  goalName,
  saved = 0,
  target = 0,
  onAddMoney,
  onEdit,
  onDelete,
}) {
  const savedAmount = Number(saved) || 0;
  const targetAmount = Number(target) || 0;

  const percent =
    targetAmount > 0
      ? Math.min(
          100,
          Math.round((savedAmount / targetAmount) * 100)
        )
      : 0;

  const remaining = Math.max(0, targetAmount - savedAmount);
  const achieved = targetAmount > 0 && savedAmount >= targetAmount;

  const formatMoney = (amount) =>
    Number(amount).toLocaleString("en-IN");

  return (
    <div className="goal-card">
      <div className="goal-card-top">
        <div className="goal-icon">🎯</div>

        <div className={`goal-status ${achieved ? "completed" : ""}`}>
          {achieved ? "Completed" : `${percent}%`}
        </div>
      </div>

      <div className="goal-info">
        <h3>{goalName}</h3>

        <p>
          ₹{formatMoney(savedAmount)}
          <span> of ₹{formatMoney(targetAmount)}</span>
        </p>
      </div>

      <div
        className="goal-progress"
        role="progressbar"
        aria-label={`${goalName} savings progress`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`goal-progress-fill ${achieved ? "completed" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="goal-bottom">
        <span>
          {achieved
            ? "🎉 Goal achieved!"
            : `₹${formatMoney(remaining)} remaining`}
        </span>

        <strong>{percent}%</strong>
      </div>

      <div className="goal-card-actions">
        {!achieved && (
          <button
            type="button"
            className="goal-action-btn goal-add-money"
            onClick={() => onAddMoney(goalId)}
          >
            + Add Money
          </button>
        )}

        <button
          type="button"
          className="goal-action-btn goal-edit-btn"
          onClick={() => onEdit(goalId)}
        >
          Edit
        </button>

        <button
          type="button"
          className="goal-action-btn goal-delete-btn"
          onClick={() => onDelete(goalId)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default GoalCard;
