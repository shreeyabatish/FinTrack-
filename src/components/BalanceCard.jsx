function BalanceCard({ amount, change }) {
    return (
        <div className="financial-card balance-card">

            <div className="card-top">
                <div>
                    <p className="card-label">TOTAL BALANCE</p>
                    <h2>{amount}</h2>
                </div>

                <div className="card-icon balance-icon">
                    ₹
                </div>
            </div>

            <div className="card-bottom">
                <span className="change positive">
                    ↑ {change}
                </span>

                <span className="change-text">
                    vs last month
                </span>
            </div>

        </div>
    );
}

export default BalanceCard;