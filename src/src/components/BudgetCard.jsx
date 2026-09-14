import React from "react";

function BudgetCard({ category, spent, budget }) {

    const safeSpent = Number(spent) || 0;
    const safeBudget = Number(budget) || 0;

    const percent =
        safeBudget > 0
            ? Math.round((safeSpent / safeBudget) * 100)
            : 0;

    const remaining = safeBudget - safeSpent;

    let barColor = "#2e7d5b";

    if (percent >= 100) {
        barColor = "#dc3545";
    } else if (percent >= 80) {
        barColor = "#e6a817";
    }

    return (
        <div className="budget-card">

            <div className="budget-card-top">

                <div>
                    <p className="budget-category">
                        {category}
                    </p>

                    <h3>
                        ₹{safeSpent.toLocaleString("en-IN")}
                    </h3>

                    <span className="budget-limit">
                        of ₹{safeBudget.toLocaleString("en-IN")}
                    </span>
                </div>

                <div
                    className="budget-percent"
                    style={{ color: barColor }}
                >
                    {percent}%
                </div>

            </div>

            <div className="budget-progress">

                <div
                    className="budget-progress-fill"
                    style={{
                        width: `${Math.min(percent, 100)}%`,
                        background: barColor
                    }}
                />

            </div>

            <div className="budget-card-bottom">

                {remaining >= 0 ? (
                    <span>
                        ₹{remaining.toLocaleString("en-IN")} remaining
                    </span>
                ) : (
                    <span className="budget-warning">
                        ₹{Math.abs(remaining).toLocaleString("en-IN")} over budget
                    </span>
                )}

            </div>

        </div>
    );
}

export default BudgetCard;