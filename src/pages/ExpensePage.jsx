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
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [editExpenseId, setEditExpenseId] = useState(null); // ID of the expense being edited
  const [montlySpent, setMontlySpent] = useState(0.0);

  // State for expenses and filter
  const [expenses, setExpenses] = useState([]);
  const [filterDate, setFilterDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const userId = 1; // Example userId, you can modify this

  // Fetch expenses from the backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/expenses?userId=${userId}`
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
          "http://localhost:8090/enums/allCategories"
        );
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

  // Handle form submission to add or edit an expense
  const handleAddOrEditExpense = async (e) => {
    e.preventDefault();
    try {
      const newExpense = {
        id: editExpenseId,
        category,
        description,
        amount: parseFloat(amount),
        date,
        userId: userId,
      };

      if (editMode) {
        // Send a PUT request to update the expense
        await axios.put(`http://localhost:8090/expenses/${editExpenseId}`, newExpense);
      } else {
        // Send a POST request to add a new expense
        await axios.post("http://localhost:8090/expenses", newExpense);
      }

      // Refresh the expense list after adding or editing
      const response = await axios.get(
        `http://localhost:8090/expenses?userId=${userId}`
      );
      setExpenses(response.data);

      // Clear the form and exit edit mode
      setCategory("");
      setDescription("");
      setAmount("");
      setDate("");
      setEditMode(false);
      setEditExpenseId(null);
    } catch (error) {
      console.error("Error adding/editing expense", error);
    }
  };

  // Handle edit click
  const handleEditClick = (expense) => {
    setCategory(expense.category);
    setDescription(expense.description);
    setAmount(expense.amount);
    setDate(expense.date);
    setEditMode(true);
    setEditExpenseId(expense.id);
  };

  // Handle delete click
  const handleDeleteClick = async (expenseId) => {
     // Show a confirmation dialog
  const confirmed = window.confirm("Are you sure you want to delete this expense?");
  
  if (confirmed) {
    try {
      // Proceed with deletion if user confirms
      await axios.delete(`http://localhost:8090/expenses/${expenseId}`);

      // Refresh the expense list after deletion
      const response = await axios.get(
        `http://localhost:8090/expenses?userId=${userId}`
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  } else {
    // If the user cancels, do nothing
    console.log("Delete action was canceled.");
  }
  };

  useEffect(() => {
    const getAllExpensesForSelectedMonth = async () => {
        // Ensure the selected date is not empty
        if (!date) {
            console.error("No date selected");
            return; // Exit if no date is selected
        }

        // Get the year and month from the selected date
        const selectedDate = new Date(date); // Convert the selected date to a Date object
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Format month to always have two digits
        const month_str = `${year}-${month}`; // Create the month string
        try {
            const response = await axios.get(
                `http://localhost:8090/expenses/monthly?userId=${userId}&month=${month_str}`
            );
            
            // Check the response structure
            if (response.data) {
                setMontlySpent(response.data); // Update monthly spent state
            } else {
                console.log("No data returned for this month.");
                setMontlySpent(0); // Set to zero if no data
            }
        } catch (error) {
            console.error("Error fetching expenses", error);
        }
    };

    getAllExpensesForSelectedMonth(); // Call the function
}, [date, userId]); // Dependencies to watch

  return (
      
    <div className="container">
      <div>
      <h2>Money Spent this month: {montlySpent}</h2>
      </div>

      <h1>{editMode ? "Edit Expense" : "Add Expense"}</h1>

      <form onSubmit={handleAddOrEditExpense}>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat}>
                {cat}
              </option>
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

        <button type="submit">
          {editMode ? "Save Changes" : "Add Expense"}
        </button>
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
            {expense.date}{" "}
            <button onClick={() => handleEditClick(expense)}>Edit</button>
            <button onClick={() => handleDeleteClick(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpensePage;
