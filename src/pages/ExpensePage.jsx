import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css"; // Import the CSS file
import { FaTrash, FaEdit } from "react-icons/fa"; // Import the delete icon from Font Awesome

function ExpensePage() {
  // State for form fields
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [editExpenseId, setEditExpenseId] = useState(null); // ID of the expense being edited

  // State for expenses and filter
  const [expenses, setExpenses] = useState([]);
  const [filterDate, setFilterDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [user, setUser] = useState(null);

  const userId = 1; // Example userId, you can modify this

  const [monthlySpending, setMonthlySpending] = useState({});

  useEffect(() => {
    // Fetch user data (you can replace the URL with your actual endpoint)
    axios.get(`http://localhost:8090/user/${userId}`) // Adjust the endpoint as necessary
        .then(response => {
            setUser(response.data); // Assuming response.data contains user information
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
}, []);

useEffect(() => {
    
}, [user]); // Add dependencies as needed
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

  // Fetch monthly spending for the selected month
  useEffect(() => {
    const fetchMonthlySpending = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/expenses/monthly?userId=${userId}&month=${filterDate}`
        );
        setMonthlySpending((prev) => ({
          ...prev,
          [filterDate]: response.data || 0, // Store spending for the specific month
        }));
      } catch (error) {
        console.error("Error fetching monthly spending", error);
      }
    };

    fetchMonthlySpending();
  }, [filterDate, userId]);

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
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8090/expenses/${expenseId}`);

        // Refresh the expense list after deletion
        const response = await axios.get(
          `http://localhost:8090/expenses?userId=${userId}`
        );
        setExpenses(response.data);
        alert("Expense deleted successfully!");
      } catch (error) {
        console.error("Error deleting expense", error);
        alert("Error deleting expense: " + error.message);
      }
    } else {
      console.log("Delete action was canceled.");
    }
  };

  return (
    <div className="container">
      <div>
        <h2>Money Spent this month: {monthlySpending[filterDate] || 0}</h2>
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
            <strong>Amount:</strong> {expense.amount} {user.preferredCurrency} | <strong>Date:</strong>{" "}
            {expense.date}{" "}
            <button onClick={() => handleEditClick(expense)}>
              <FaEdit />
            </button>
            <button onClick={() => handleDeleteClick(expense.id)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpensePage;
