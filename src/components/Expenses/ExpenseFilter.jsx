// components/ExpenseFilter.jsx
import React from "react";

function ExpenseFilter({ filterDate, onFilterChange }) {
    return (
        <div className="filter-section">
            <label>Filter by Month:</label>
            <input
                type="month"
                value={filterDate}
                onChange={(e) => onFilterChange(e.target.value)}
            />
        </div>
    );
}

export default ExpenseFilter;
