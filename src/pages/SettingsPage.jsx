import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SettingsPage.css"; // Import the CSS file

function SettingsPage() {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [categories, setCategories] = useState([]); // Categories state
  const [newCategory, setNewCategory] = useState(""); // New category input
  const [newCategoryBudget, setNewCategoryBudget] = useState(""); // New category budget input
  const [userCategoryBudgets, setUserCategoryBudgets] = useState([]); // User category budgets

  const userId = 1; // Example userId, you can modify this

  useEffect(() => {
    // Fetch user data from the API (replace with your actual API call)
    axios
      .get(`http://localhost:8090/user/${userId}`)
      .then((response) => {
        const userData = response.data;
        setName(userData.name);
        setCurrency(userData.preferredCurrency);
        setMonthlyBudget(userData.monthlyBudget);
        setEmail(userData.email);
        setId(userData.id);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/enums/allCategories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

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
        }
        fetchCategoryBudgets();
  }, [userCategoryBudgets]); 

  // Save the updated user data
  const handleSave = async (event) => {
    event.preventDefault();

    const updatedData = {
      name,
      preferredCurrency: currency,
      monthlyBudget: parseFloat(monthlyBudget),
      email,
    };

    try {
      const response = await axios.patch(
        `http://localhost:8090/user/${userId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure JSON is sent
          },
        }
      );

      alert("User details updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating user data: " + error.message);
    }
  };

  

  // Handle opening and closing of the modal
  const handleAddCategoryBudget = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCategory(""); // Reset the form values
    setNewCategoryBudget("");
  };

const handleSaveCategoryBudget = async () => {
    const newBudget = {
        category: newCategory,
        budget_amount: parseFloat(newCategoryBudget),
        user_id: id,
    };

    try {
        const response = await axios.post(
            "http://localhost:8090/category-budgets",
            newBudget,
            {
                headers: {
                    "Content-Type": "application/json", // Ensure JSON is sent
                },
            }
        );

        setCategoryBudgets([...categoryBudgets, response.data]);

        alert("Category budget added successfully!");
    } catch (error) {
        console.error("Error saving category budget:", error);
        alert("Error saving category budget: " + error.message);
    }

    handleCloseModal(); // Close modal after adding the category
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
          <input
            type="text"
            className="SettingsPage__input"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
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
            <label className="SettingsPage__label"> {index + 1}</label>
            <input
              type="text"
              className="SettingsPage__input"
              value={budget.category}
              readOnly
            />
            <input
              type="text"
              className="SettingsPage__input"
              value={budget.budget_amount}
              readOnly
            />
          </div>
        ))}

        <button
          className="SettingsPage__categoryButton"
          onClick={handleAddCategoryBudget}
        >
          Add Category Budget
        </button>
      </div>

      {/* Modal for adding category budget */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Category</h3>
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
            <button onClick={handleSaveCategoryBudget}>Add Category</button>
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
