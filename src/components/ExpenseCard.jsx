function ExpenseCard({ amount, change }) {
    return (
        <div className="financial-card">

            <div className="card-top">
                <div>
                    <p className="card-label">TOTAL EXPENSE</p>
                    <h2>{amount}</h2>
                </div>

                <div className="card-icon expense-icon">
                    ↘
                </div>
            </div>

            <div className="card-bottom">
                <span className="change negative">
                    ↓ {change}
                </span>

                <span className="change-text">
                    vs last month
                </span>
            </div>

        </div>
    );
}

export default ExpenseCard;