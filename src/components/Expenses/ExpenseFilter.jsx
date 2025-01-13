import React from "react";
import DatePicker from "react-datepicker";

function ExpenseFilter({ filterDate, onFilterChange }) {
  const handleDateChange = (date) => {
    onFilterChange(date); // Pass the date directly to the parent
  };

  return (
    <div className="expense-filter-section">
      <label className="expense-label">Filter by Month:</label>
      <DatePicker
        selected={filterDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM"
        showMonthYearPicker // Restrict to month and year selection
        className="expense-input"
      />
    </div>
  );
}

export default ExpenseFilter;
