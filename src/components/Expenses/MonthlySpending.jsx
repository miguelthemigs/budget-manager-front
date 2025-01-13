// components/MonthlySpending.jsx
import React from "react";

function MonthlySpending({ spending, currency }) {
    return (
        <div>
            <h2>Money Spent this Month: {spending || 0} {currency}</h2>
        </div>
    );
}

export default MonthlySpending;
