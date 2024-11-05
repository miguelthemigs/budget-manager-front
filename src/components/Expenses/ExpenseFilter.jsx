import React from "react";

function ExpenseFilter({ filterDate, onFilterChange }) {
    return (
        <div className="expense-filter-section">
            <label className="expense-label">Filter by Month:</label>
            <input
                type="month"
                value={filterDate}
                onChange={(e) => onFilterChange(e.target.value)}
                className="expense-input"
            />
        </div>
    );
}

export default ExpenseFilter;
