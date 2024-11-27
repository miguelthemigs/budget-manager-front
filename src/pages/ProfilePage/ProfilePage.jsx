import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom"; // Use NavLink for navigation
import { FiSettings } from "react-icons/fi"; // Import the settings icon from react-icons
import "./ProfilePage.css"; // Import the CSS file
import TokenManager from "../../services/TokenManager";
import apiClient from "../../services/ApiInterceptor";

function ProfilePage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [monthlySpending, setMonthlySpending] = useState({});
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [categorySpending, setCategorySpending] = useState({});

  const [filterDate, setFilterDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const userId = TokenManager.getUserId();

  // Fetch user data directly from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get(`${API_BASE_URL}/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  // Fetch category budgets directly from the API
  useEffect(() => {
    const fetchCategoryBudgets = async () => {
      try {
        const response = await apiClient.get(
          `${API_BASE_URL}/category-budgets/user/${userId}`
        );
        setCategoryBudgets(response.data);
      } catch (error) {
        console.error("Error fetching category budgets:", error);
      }
    };
    fetchCategoryBudgets();
  }, [userId]);

  // Fetch monthly spending for the selected month directly from the API
  useEffect(() => {
    const fetchMonthlySpending = async () => {
      try {
        const response = await apiClient.get(
          `${API_BASE_URL}/expenses/monthly?userId=${userId}&month=${filterDate}`
        );
        setMonthlySpending((prev) => ({
          ...prev,
          [filterDate]: response.data || 0, // Store spending for the specific month
        }));
      } catch (error) {
        console.error("Error fetching monthly spending", error);
      }
    };
    fetchMonthlySpending();
  }, [filterDate, userId]);

  // Fetch category spending directly from the API for each category
  useEffect(() => {
    const fetchCategorySpending = async () => {
      const updatedSpending = {};
      for (const budget of categoryBudgets) {
        try {
          const response = await apiClient.get(
            `${API_BASE_URL}/expenses/categoryBudget`,
            {
              params: {
                userId,
                category: budget.category,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
              },
            }
          );
          updatedSpending[budget.category] = response.data; // Store spending by category
        } catch (error) {
          console.error(
            `Error fetching spending for category ${budget.category}:`,
            error
          );
        }
      }
      setCategorySpending(updatedSpending); // Update state
    };

    if (categoryBudgets.length > 0) {
      fetchCategorySpending();
    }
  }, [categoryBudgets, userId]);

  const handleLogout = () => {
    console.log("User logged out");
  };

  const percentageSpent =
    user && user.monthlyBudget
      ? ((monthlySpending[filterDate] || 0) / user.monthlyBudget) * 100
      : 0;

  return (
    <div>
      <NavLink to="/settings" className="ProfilePage__settingsIcon">
        <FiSettings size={24} />
      </NavLink>

      <h1 className="ProfilePage__heading">Profile Page</h1>

      {user ? (
        <div>
          <h2 className="ProfilePage__subheading">Welcome, {user.name}!</h2>
          <button className="ProfilePage__button" onClick={handleLogout}>
            Logout
          </button>

          {/* Stats Section */}
          <div className="ProfilePage__statsContainer">
            <h3 className="ProfilePage__statsHeading">Spending Statistics</h3>
            <p className="ProfilePage__statsPlaceholder">
              Graph or statistics will go here.
            </p>

            <div className="ProfilePage__statsInfo">
              <p className="ProfilePage__statItem">
                <span className="ProfilePage__label">Monthly Budget:</span>{" "}
                {user.monthlyBudget} {user.preferredCurrency}
              </p>
              <p className="ProfilePage__statItem">
                <span className="ProfilePage__label">
                  Percentage of budget spent:
                </span>{" "}
                {percentageSpent.toFixed(2)}% (
                {monthlySpending[filterDate] || 0} {user.preferredCurrency})
              </p>
              <p className="ProfilePage__statItem">
                <span className="ProfilePage__label">
                  Left to spend this month:
                </span>{" "}
                {user.monthlyBudget - (monthlySpending[filterDate] || 0)}{" "}
                {user.preferredCurrency}
              </p>
            </div>
          </div>

          {/* Widgets Section */}
          <div className="ProfilePage__widgets">
            {categoryBudgets.map((budget) => {
              const spending = categorySpending[budget.category] || 0; // Default to 0 if no spending found
              const percentageSpent = (
                (spending / budget.budget_amount) *
                100
              ).toFixed(2);

              return (
                <div className="ProfilePage__widget" key={budget.category}>
                  <h4>{budget.category}</h4>
                  <div>
                    {percentageSpent}% Spent ({spending} /{" "}
                    {budget.budget_amount})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="ProfilePage__loading">Loading user data...</p>
      )}
    </div>
  );
}

export default ProfilePage;
