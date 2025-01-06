import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

function ExpenseList({ expenses, onEdit, onDelete, userCurrency }) {
    return (
        <div className="expense-list">
            {expenses.map((expense) => (
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
        </div>
    );
}

export default ExpenseList;
