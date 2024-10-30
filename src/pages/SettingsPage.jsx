import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SettingsPage.css";
import { FaTrash, FaEdit } from "react-icons/fa";

function SettingsPage() {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");
  const [userCategoryBudgets, setUserCategoryBudgets] = useState([]);
  const [editingBudgetId, setEditingBudgetId] = useState(null);

  const userId = 1;

  useEffect(() => {
    axios.get(`http://localhost:8090/user/${userId}`).then((response) => {
      const userData = response.data;
      setName(userData.name);
      setCurrency(userData.preferredCurrency);
      setMonthlyBudget(userData.monthlyBudget);
      setEmail(userData.email);
      setId(userData.id);
    }).catch((error) => {
      console.error("Error fetching user data:", error);
    });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8090/enums/allCategories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, [  ]);

  useEffect(() => {
    const fetchCategoryBudgets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/category-budgets/user/${userId}`
        );
        setUserCategoryBudgets(response.data);
      } catch (error) {
        console.error("Error fetching category budgets", error);
      }
    };
  
    fetchCategoryBudgets();
  }, [userId], [userCategoryBudgets]); 
  

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("http://localhost:8090/enums/allCurrencies");
        setCurrencies(response.data);
      } catch (error) {
        console.error("Error fetching currencies", error);
      }
    };
    fetchCurrencies();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    const updatedData = {
      name,
      preferredCurrency: currency,
      monthlyBudget: parseFloat(monthlyBudget),
      email,
    };

    try {
      await axios.patch(`http://localhost:8090/user/${userId}`, updatedData, {
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
      user_id: id,
    };
    try {
      if (editingBudgetId) {
        await axios.put(`http://localhost:8090/category-budgets/${editingBudgetId}`, newBudget);
      } else {
        const response = await axios.post("http://localhost:8090/category-budgets", newBudget);
        setUserCategoryBudgets([...userCategoryBudgets, response.data]); // Optimistic update
      }
    } catch (error) {
      console.error("Error saving category budget:", error);
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
        await axios.delete(`http://localhost:8090/category-budgets/${categoryBudgetId}`);
        const response = await axios.get(`http://localhost:8090/category-budgets/user/${userId}`);
        setCategoryBudgets(response.data);
        alert("Category budget deleted successfully!");
      } catch (error) {
        console.error("Error deleting category budget:", error);
        alert("Error deleting category budget: " + error.message);
      }
    }
  };

  return (
    <div className="SettingsPage__container">
      <h1 className="SettingsPage__heading">Settings</h1>
      <p>Update details:</p>
      <form className="SettingsPage__form" onSubmit={handleSave}>
        <div>
          <label className="SettingsPage__label">Name</label>
          <input
            type="text"
            className="SettingsPage__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="SettingsPage__label">Preferred Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} required>
            <option value="">Select a currency</option>
            {currencies.map((curr) => (
              <option key={curr.id} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="SettingsPage__label">Monthly Budget</label>
          <input
            type="number"
            className="SettingsPage__input"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
          />
        </div>

        <div>
          <label className="SettingsPage__label">Email</label>
          <input
            type="email"
            className="SettingsPage__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="SettingsPage__button">
          Save
        </button>
      </form>

      <div className="SettingsPage__categorySection">
        <h3>Category Budgets</h3>
        {userCategoryBudgets.map((budget, index) => (
          <div key={index}>
            <input type="text" className="SettingsPage__input" value={budget.category} readOnly />
            <input type="text" className="SettingsPage__input" value={budget.budget_amount} readOnly />
            <button onClick={() => handleDeleteCategoryBudget(budget.id)}>
              <FaTrash />
            </button>
            <button onClick={() => handleEditCategoryBudget(budget)}>
              <FaEdit />
            </button>
          </div>
        ))}

        <button className="SettingsPage__categoryButton" onClick={handleAddCategoryBudget}>
          Add Category Budget
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingBudgetId ? "Edit Category Budget" : "Add New Category"}</h3>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat}>
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
            <button onClick={handleSaveCategoryBudget}>
              {editingBudgetId ? "Update Category" : "Add Category"}
            </button>
            <button className="cancel-button" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
