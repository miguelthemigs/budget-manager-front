import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpensePage.css"; // Import the CSS file

function ExpensePage() {
  // State for form fields
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // State for expenses and filter
  const [expenses, setExpenses] = useState([]);
  const [filterDate, setFilterDate] = useState(() => {
    // Default filter: current month (YYYY-MM)
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const userId = 1; // Example userId, you can modify this

  // Fetch expenses from the backend (filtered by userId)
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/expenses?userId=${userId}`
        );
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses", error);
      }
    };

    fetchExpenses();
  }, [userId]);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/enums/allCategories"
        ); // Adjust this endpoint
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  // Filter expenses by the current month
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseYearMonth = `${expenseDate.getFullYear()}-${String(
      expenseDate.getMonth() + 1
    ).padStart(2, "0")}`;
    return expenseYearMonth === filterDate;
  });

  // Handle form submission to add a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const newExpense = {
        category,
        description,
        amount: parseFloat(amount),
        date,
        userId: userId, // Associate the expense with the user
      };

      await axios.post("http://localhost:8080/expenses", newExpense);

      // Refresh the expense list after adding a new expense
      const response = await axios.get(
        `http://localhost:8080/expenses?userId=${userId}`
      );
      setExpenses(response.data);

      // Clear the form
      setCategory("");
      setDescription("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  return (
    <div className="container">
      <h1>Expense Manager</h1>

      <form onSubmit={handleAddExpense}>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id}>{cat}</option> // Adjust according to your category structure
            ))}
          </select>
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Expense</button>
      </form>

      {/* Filter by Date */}
      <div className="filter-section">
        <label>Filter by Month:</label>
        <input
          type="month"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Expenses List */}
      <h2>Expenses</h2>
      <ul>
        {filteredExpenses.map((expense) => (
          <li key={expense.id}>
            <strong>Category:</strong> {expense.category} |{" "}
            <strong>Description:</strong> {expense.description} |{" "}
            <strong>Amount:</strong> {expense.amount} | <strong>Date:</strong>{" "}
            {expense.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpensePage;
