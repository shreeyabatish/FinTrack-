import { useState } from "react";

function TransactionForm({ onAddTransaction }) {

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    // Validation
    if (!amount || !date || !description) {
      alert("Please fill all the fields");
      return;
    }

    const newTransaction = {
      name: category,
      amount: Number(amount),
      type: type,
      category: category,
      date: date,
      description: description
    };

    // Send transaction to parent component
    onAddTransaction(newTransaction);

    // Reset form
    setAmount("");
    setType("Expense");
    setCategory("Food");
    setDate("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Add Transaction</h2>

      {/* Amount */}
      <div>
        <label>Amount:</label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="₹"
        />
      </div>

      {/* Type */}
      <div>
        <label>Type:</label>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label>Category:</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Salary">Salary</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label>Date:</label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label>Description:</label>

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>

      {/* Add button */}
      <button type="submit">
        ADD
      </button>

    </form>
  );
}

export default TransactionForm;