// components/MonthlySpending.jsx
import React from "react";

function MonthlySpending({ spending }) {
    return (
        <div>
            <h2>Money Spent this month: {spending || 0}</h2>
        </div>
    );
}

export default MonthlySpending;
