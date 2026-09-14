function BudgetCard({ category, spent, budget }) {
    const percent = budget > 0
        ? Math.round((spent / budget) * 100)
        : 0;

    const remaining = budget - spent;

    let status = "On track";
    let statusClass = "good";

    if (percent >= 100) {
        status = "Over budget";
        statusClass = "danger";
    } else if (percent >= 80) {
        status = "Almost there";
        statusClass = "warning";
    }

    const displayPercent = Math.min(percent, 100);

    return (
        <div className="budget-card">

            <div className="budget-card-header">
                <div className="budget-category">
                    <div className="budget-icon">
                        {category === "Food" && "🍽️"}
                        {category === "Travel" && "✈️"}
                        {category === "Shopping" && "🛍️"}
                        {!["Food", "Travel", "Shopping"].includes(category) && "💰"}
                    </div>

                    <div>
                        <h3>{category}</h3>
                        <span>Monthly budget</span>
                    </div>
                </div>

                <span className={`budget-status ${statusClass}`}>
                    {status}
                </span>
            </div>

            <div className="budget-amount">
                <div>
                    <span className="spent-label">Spent</span>
                    <strong>₹{spent.toLocaleString("en-IN")}</strong>
                </div>

                <div className="budget-total">
                    <span>of</span>
                    <strong>₹{budget.toLocaleString("en-IN")}</strong>
                </div>
            </div>

            <div className="budget-progress">
                <div
                    className={`budget-progress-fill ${statusClass}`}
                    style={{ width: `${displayPercent}%` }}
                />
            </div>

            <div className="budget-footer">
                <span>{percent}% used</span>

                <span className={remaining < 0 ? "over-budget" : ""}>
                    {remaining >= 0
                        ? `₹${remaining.toLocaleString("en-IN")} remaining`
                        : `₹${Math.abs(remaining).toLocaleString("en-IN")} over`
                    }
                </span>
            </div>

        </div>
    );
}

export default BudgetCard;