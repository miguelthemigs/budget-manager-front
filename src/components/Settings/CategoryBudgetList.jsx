import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const CategoryBudgetList = ({ userCategoryBudgets, onEdit, onDelete }) => {
  return (
    <div className="SettingsPage__categorySection">
      <h3>Category Budgets</h3>
      {userCategoryBudgets.map((budget, index) => (
        <div key={index}>
          <input type="text" className="SettingsPage__input" value={budget.category} readOnly />
          <input type="text" className="SettingsPage__input" value={budget.budget_amount} readOnly />
          <button onClick={() => onDelete(budget.id)}>
            <FaTrash />
          </button>
          <button onClick={() => onEdit(budget)}>
            <FaEdit />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CategoryBudgetList;
