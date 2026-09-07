import { useState } from "react";
import TransactionForm from "./TransactionForm";

function Transactions() {

  // Transactions data
  const [transactions, setTransactions] = useState([
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

  // Search state
  const [search, setSearch] = useState("");

  // Filter state
  const [filter, setFilter] = useState("All");

  // Form visibility
  const [showForm, setShowForm] = useState(false);


  // Search + Filter
  const filteredTransactions = transactions.filter((transaction) => {

    const matchesSearch = transaction.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || transaction.type === filter;

    return matchesSearch && matchesFilter;
  });


  // Add new transaction
  const addTransaction = (newTransaction) => {

    setTransactions((prevTransactions) => [
      ...prevTransactions,
      {
        ...newTransaction,
        id: Date.now()
      }
    ]);

    setShowForm(false);
  };


  return (
    <div>

      <h1>Transactions</h1>


      {/* Search */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* Filters */}
      <div>

        <button onClick={() => setFilter("All")}>
          All
        </button>

        <button onClick={() => setFilter("Income")}>
          Income
        </button>

        <button onClick={() => setFilter("Expense")}>
          Expense
        </button>

      </div>


      {/* Transaction List */}
      <div>

        {filteredTransactions.map((transaction) => (

          <div key={transaction.id}>

            <h3>{transaction.name}</h3>

            <p>
              {transaction.type === "Income" ? "+" : "-"}
              ₹{transaction.amount}
            </p>

            <p>{transaction.type}</p>

            {transaction.date && (
              <p>Date: {transaction.date}</p>
            )}

            {transaction.description && (
              <p>Description: {transaction.description}</p>
            )}

          </div>

        ))}

      </div>


      {/* Add Transaction Button */}
      <button onClick={() => setShowForm(!showForm)}>
        + Add Transaction
      </button>


      {/* Transaction Form */}
      {showForm && (
        <TransactionForm
          onAddTransaction={addTransaction}
        />
      )}

    </div>
  );
}

export default Transactions;