import React, { useState, useEffect } from "react";
import "./SettingsPage.css";
import CategoryBudgetList from "../../components/Settings/CategoryBudgetList.jsx";
import CategoryBudgetModal from "../../components/Settings/CategoryBudgetModal.jsx";
import UserDetailsForm from "../../components/Settings/UserDetailsForm.jsx";
import TokenManager from "../../services/TokenManager";
import apiClient from "../../services/ApiInterceptor.jsx";
import AuthAPI from "../../services/AuthAPI.jsx";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

function SettingsPage({
  userData,
  currencies,
  categories,
  userCategoryBudgets,
  setUserCategoryBudgets,
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
  const userId = TokenManager.getUserId();

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
      password: userData.password,
      preferredCurrency: currency,
      monthlyBudget: parseFloat(monthlyBudget),
      email,
      role: userData.role,
    };

    try {
      await apiClient.put(`${API_BASE_URL}/user/${userId}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("User details updated successfully!");
      setMonthlyBudget(updatedData.monthlyBudget);
      setCurrency(updatedData.preferredCurrency);
      setName(updatedData.name);
      setEmail(updatedData.email);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating user data: " + error.message);
    }
  };

  useEffect(() => {
    // Fetch the current user data when the component mounts
    AuthAPI.fetchCurrentUser()
      .then((response) => {
        setMonthlyBudget(response.monthlyBudget);
        setCurrency(response.preferredCurrency);
        setName(response.name);
        setEmail(response.email);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      });
  }, []);

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
      user_id: userId,
    };

    try {
      if (editingBudgetId) {
        // Update existing budget
        await apiClient.put(`${API_BASE_URL}/category-budgets/${editingBudgetId}`, newBudget);
        setUserCategoryBudgets((prevBudgets) =>
          prevBudgets.map((budget) =>
            budget.id === editingBudgetId ? { ...budget, ...newBudget } : budget
          )
        );
        toast.success("Category budget updated successfully!");
      } else {
        // Create new budget
        const response = await apiClient.post(`${API_BASE_URL}/category-budgets`, newBudget);
        toast.success("Category budget added successfully!");
        setUserCategoryBudgets([...userCategoryBudgets, response.data]); // Optimistic update
        toast.success("Category budget added successfully!");
      }
    } catch (error) {
      console.error("Error saving category budget:", error);
      toast.error("Error saving category budget: there is already a budget for this category.");
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
        await apiClient.delete(`${API_BASE_URL}/category-budgets/${categoryBudgetId}`);
        setUserCategoryBudgets((prevBudgets) =>
          prevBudgets.filter((budget) => budget.id !== categoryBudgetId)
        );
        toast.success("Category budget deleted successfully!");
      } catch (error) {
        console.error("Error deleting category budget:", error);
        toast.error("Error deleting category budget: " + error.message);
      }
    } else {
      toast.info("Delete action canceled.");
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
        onSave={handleSaveCategoryBudget}
        editingBudgetId={editingBudgetId}
      />

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

export default SettingsPage;
