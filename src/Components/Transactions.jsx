import { useState } from "react";

function Transactions() {

  const [transactions] = useState([
    {
      id: 1,
      name: "Food",
      amount: 500,
      type: "Expense"
    },
    {
      id: 2,
      name: "Travel",
      amount: 300,
      type: "Expense"
    },
    {
      id: 3,
      name: "Salary",
      amount: 50000,
      type: "Income"
    },
    {
      id: 4,
      name: "Shopping",
      amount: 800,
      type: "Expense"
    }
  ]);

  return (
    <div>

      <h1>Transactions</h1>

      {transactions.map((transaction) => (
        <div key={transaction.id}>

          <h3>{transaction.name}</h3>

          <p>
            {transaction.type === "Income" ? "+" : "-"}
            ₹{transaction.amount}
          </p>

          <p>{transaction.type}</p>

        </div>
      ))}

    </div>
  );
}

export default Transactions;