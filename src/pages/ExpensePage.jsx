import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css"; // Import the CSS file
import { FaTrash, FaEdit } from "react-icons/fa"; // Import the delete icon from Font Awesome
import MonthlySpending from '../components/Expenses/MonthlySpending';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import ExpenseFilter from '../components/Expenses/ExpenseFilter';
import ExpenseList from '../components/Expenses/ExpenseList';

function ExpensePage({ user, categories, expenses, setExpenses }) {
  // State for form fields
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [editExpenseId, setEditExpenseId] = useState(null); // ID of the expense being edited

  const userId = 1; // Example userId, you can modify this

  // Fetch monthly spending for the selected month
  const [monthlySpending, setMonthlySpending] = useState({});
  const [filterDate, setFilterDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

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
  const handleAddOrEditExpense = async (newExpense) => {
    try {
      const expenseData = {
        id: editExpenseId,
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        userId: userId,
      };

      console.log("Expense Data to be sent:", expenseData); // Log the data
      if (editMode) {
        // Send a PUT request to update the expense
        await axios.put(`http://localhost:8090/expenses/${editExpenseId}`, expenseData);
      } else {
        // Send a POST request to add a new expense
        await axios.post("http://localhost:8090/expenses", expenseData);
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
      setDate(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
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

  // Prepare the current expense data for the form
  const currentExpense = editMode
  ? { category, description, amount, date }
  : { category: "", description: "", amount: "", date: new Date().toISOString().split("T")[0] }; // Default values

  return (
    <div className="container">
      <MonthlySpending spending={monthlySpending[filterDate]} />
      <ExpenseForm
        onSubmit={handleAddOrEditExpense}
        editMode={editMode}
        categories={categories}
        expense={currentExpense} // Pass the current expense to the form
        userCurrency={user?.preferredCurrency} // Adjust to match your user currency
      />
      <ExpenseFilter filterDate={filterDate} onFilterChange={setFilterDate} />
      <ExpenseList
        expenses={filteredExpenses}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        userCurrency={user?.preferredCurrency} // Adjust as needed
      />
    </div>
  );
}

export default ExpensePage;
