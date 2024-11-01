// components/ExpenseForm.jsx
import React, { useState, useEffect } from "react";

function ExpenseForm({ onSubmit, editMode, categories, expense, userCurrency }) {
    const [category, setCategory] = useState(expense?.category || "");
    const [description, setDescription] = useState(expense?.description || "");
    const [amount, setAmount] = useState(expense?.amount || "");
    const [date, setDate] = useState(expense?.date || new Date().toISOString().split("T")[0]);

    useEffect(() => {
        if (expense) {
            setCategory(expense.category);
            setDescription(expense.description);
            setAmount(expense.amount);
            setDate(expense.date);
        }
    }, [expense]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ category, description, amount: parseFloat(amount), date });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{editMode ? "Edit Expense" : "Add Expense"}</h1>
            <div>
                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Amount:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <button type="submit">{editMode ? "Save Changes" : "Add Expense"}</button>
        </form>
    );
}

export default ExpenseForm;
