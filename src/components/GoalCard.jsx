function GoalCard({ goalName, saved, target }) {
    const percent = Math.min(
        100,
        Math.round((Number(saved) / Number(target)) * 100)
    );

    const remaining = Math.max(
        0,
        Number(target) - Number(saved)
    );

    const achieved = percent >= 100;

    return (
        <div className="goal-card">

            <div className="goal-card-top">
                <div className="goal-icon">
                    🎯
                </div>

                <div className="goal-status">
                    {achieved ? "Completed" : `${percent}%`}
                </div>
            </div>

            <div className="goal-info">
                <h3>{goalName}</h3>

                <p>
                    ₹{Number(saved).toLocaleString("en-IN")}
                    <span>
                        {" "}of ₹{Number(target).toLocaleString("en-IN")}
                    </span>
                </p>
            </div>

            <div className="goal-progress">
                <div
                    className={`goal-progress-fill ${
                        achieved ? "completed" : ""
                    }`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>

            <div className="goal-bottom">
                <span>
                    {achieved
                        ? "🎉 Goal achieved!"
                        : `₹${remaining.toLocaleString("en-IN")} remaining`}
                </span>

                <strong>{percent}%</strong>
            </div>

        </div>
    );
}

export default GoalCard;