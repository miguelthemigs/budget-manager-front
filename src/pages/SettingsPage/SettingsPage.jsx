import React, { useState, useEffect } from "react";
import "./SettingsPage.css";
import CategoryBudgetList from '../../components/Settings/CategoryBudgetList.jsx';
import CategoryBudgetModal from '../../components/Settings/CategoryBudgetModal.jsx';
import UserDetailsForm from '../../components/Settings/UserDetailsForm.jsx';
import axios from 'axios';

function SettingsPage({
  userData,
  currencies,
  categories,
  userCategoryBudgets,
  setUserCategoryBudgets
}) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [name, setName] = useState(userData?.name || "");
  const [currency, setCurrency] = useState(userData?.preferredCurrency || "");
  const [monthlyBudget, setMonthlyBudget] = useState(userData?.monthlyBudget || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState(null);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setCurrency(userData.preferredCurrency);
      setMonthlyBudget(userData.monthlyBudget);
      setEmail(userData.email);
    }
  }, [userData]);

  const handleSave = async (event) => {
    event.preventDefault();
    const updatedData = {
      name,
      preferredCurrency: currency,
      monthlyBudget: parseFloat(monthlyBudget),
      email,
    };

    try {
      await axios.patch(`${API_BASE_URL}/user/${userData.id}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("User details updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating user data: " + error.message);
    }
  };

  const handleAddCategoryBudget = () => {
    setIsModalOpen(true);
    setEditingBudgetId(null);
    setNewCategory("");
    setNewCategoryBudget("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCategory("");
    setNewCategoryBudget("");
  };

  const handleSaveCategoryBudget = async () => {
    const newBudget = {
        id: editingBudgetId,
        category: newCategory,
        budget_amount: parseFloat(newCategoryBudget),
        user_id: userData?.id, // Use userData?.id to get the user ID
    };

    try {
        if (editingBudgetId) {
            // Update existing budget
            await axios.put(`${API_BASE_URL}/category-budgets/${editingBudgetId}`, newBudget);
            // Update the budget in the state
            setUserCategoryBudgets(prevBudgets => 
                prevBudgets.map(budget => 
                    budget.id === editingBudgetId ? { ...budget, ...newBudget } : budget
                )
            ); 
            alert("Category budget updated successfully!");
        } else {
            // Create new budget
            const response = await axios.post(`${API_BASE_URL}/category-budgets`, newBudget);
            setUserCategoryBudgets([...userCategoryBudgets, response.data]); // Optimistic update
            alert("Category budget added successfully!");
        }
    } catch (error) {
        console.error("Error saving category budget:", error);
        alert("Error saving category budget: there is already a budget for this category");
    }

    handleCloseModal();
};

  const handleEditCategoryBudget = (budget) => {
    setIsModalOpen(true);
    setEditingBudgetId(budget.id);
    setNewCategory(budget.category);
    setNewCategoryBudget(budget.budget_amount);
  };

  const handleDeleteCategoryBudget = async (categoryBudgetId) => {
    const confirmed = window.confirm("Are you sure you want to delete this category budget?");
    if (confirmed) {
        try {
            // Make the API call to delete the category budget
            await axios.delete(`${API_BASE_URL}/category-budgets/${categoryBudgetId}`);
            // Update the state to remove the deleted category budget
            setUserCategoryBudgets(prevBudgets => 
                prevBudgets.filter(budget => budget.id !== categoryBudgetId)
            );
            alert("Category budget deleted successfully!");
        } catch (error) {
            console.error("Error deleting category budget:", error);
            alert("Error deleting category budget: " + error.message);
        }
    }
};

  return (
    <div>
      <h1 className="SettingsPage__heading">Settings</h1>
      <p>Update details:</p>
      <UserDetailsForm
        name={name}
        setName={setName}
        currency={currency}
        setCurrency={setCurrency}
        monthlyBudget={monthlyBudget}
        setMonthlyBudget={setMonthlyBudget}
        email={email}
        setEmail={setEmail}
        currencies={currencies}
        onSave={handleSave} 
      />

      <CategoryBudgetList
        userCategoryBudgets={userCategoryBudgets}
        onEdit={handleEditCategoryBudget}
        onDelete={handleDeleteCategoryBudget}
      />

      <button className="SettingsPage__categoryButton" onClick={handleAddCategoryBudget}>
        Add Category Budget
      </button>

      <CategoryBudgetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        categories={categories}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newCategoryBudget={newCategoryBudget}
        setNewCategoryBudget={setNewCategoryBudget}
        onSave={handleSaveCategoryBudget} // Use the updated save function
        editingBudgetId={editingBudgetId}
      />
    </div>
  );
}

export default SettingsPage;