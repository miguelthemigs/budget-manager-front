// components/ExpenseList.jsx
import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

function ExpenseList({ expenses, onEdit, onDelete, userCurrency }) {
    return (
        <ul>
            {expenses.map((expense) => (
                <li key={expense.id}>
                    <strong>Category:</strong> {expense.category} |{" "}
                    <strong>Description:</strong> {expense.description} |{" "}
                    <strong>Amount:</strong> {expense.amount} {userCurrency} |{" "}
                    <strong>Date:</strong> {expense.date}{" "}
                    <button onClick={() => onEdit(expense)}>
                        <FaEdit />
                    </button>
                    <button onClick={() => onDelete(expense.id)}>
                        <FaTrash />
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default ExpenseList;
