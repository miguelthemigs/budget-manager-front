import React from "react";

const CategoryBudgetModal = ({ isOpen, onClose, categories, newCategory, setNewCategory, newCategoryBudget, setNewCategoryBudget, onSave, editingBudgetId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editingBudgetId ? "Edit Category Budget" : "Add New Category"}</h3>
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required>
          <option value="">Select a category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label>Budget Value:</label>
        <input
          type="number"
          placeholder="Budget Value"
          value={newCategoryBudget}
          onChange={(e) => setNewCategoryBudget(e.target.value)}
        />
        <button onClick={onSave}>
          {editingBudgetId ? "Update Category" : "Add Category"}
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategoryBudgetModal;
