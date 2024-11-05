import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

function ExpenseList({ expenses, onEdit, onDelete, userCurrency }) {
    return (
        <ul className="expense-list">
            {expenses.map((expense) => (
                <li key={expense.id} className="expense-list-item">
                    <strong className="expense-strong">Category:</strong> {expense.category} |{" "}
                    <strong className="expense-strong">Description:</strong> {expense.description} |{" "}
                    <strong className="expense-strong">Amount:</strong> {expense.amount} {userCurrency} |{" "}
                    <strong className="expense-strong">Date:</strong> {expense.date}{" "}
                    <button onClick={() => onEdit(expense)} className="expense-button">
                        <FaEdit />
                    </button>
                    <button onClick={() => onDelete(expense.id)} className="expense-button">
                        <FaTrash />
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default ExpenseList;
