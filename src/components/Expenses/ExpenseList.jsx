import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

function ExpenseList({ expenses, onEdit, onDelete, userCurrency }) {
  const [categoryFilter, setCategoryFilter] = useState(""); // State for category filter
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 4; // Number of items per page

  // Filter expenses by selected category
  const filteredExpenses = categoryFilter
    ? expenses.filter((expense) => expense.category === categoryFilter)
    : expenses;

  // Calculate pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const uniqueCategories = [...new Set(expenses.map((expense) => expense.category))];

  // Handle pagination navigation
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="expense-list-container">
      {/* Category Filter */}
      <div className="category-filter">
        <label htmlFor="category-select" className="category-filter-label">
          Filter by Category:
        </label>
        <select
          id="category-select"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1); // Reset to first page on category change
          }}
          className="expense-input"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Expense List */}
      <div className="expense-list">
        {paginatedExpenses.map((expense) => (
          <div key={expense.id} className="expense-list-item" data-cy="expense-item">
            <div>
              <strong className="expense-strong">Category:</strong> {expense.category}
            </div>
            <div>
              <strong className="expense-strong">Description:</strong> {expense.description}
            </div>
            <div>
              <strong className="expense-strong">Amount:</strong> {expense.amount} {userCurrency}
            </div>
            <div>
              <strong className="expense-strong">Date:</strong> {expense.date}
            </div>
            <div className="expense-item-actions">
              <button onClick={() => onEdit(expense)} className="expense-button">
                <FaEdit />
              </button>
              <button onClick={() => onDelete(expense.id)} className="expense-button" data-cy="delete_button">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {paginatedExpenses.length === 0 && (
          <div className="expense-list-empty">
            No expenses found for the selected category.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
