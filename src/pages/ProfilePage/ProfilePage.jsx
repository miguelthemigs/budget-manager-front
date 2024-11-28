import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom"; // Use NavLink for navigation
import { FiSettings } from "react-icons/fi"; // Import the settings icon from react-icons
import "./ProfilePage.css"; // Import the CSS file
import TokenManager from "../../services/TokenManager";
import apiClient from "../../services/ApiInterceptor";
import Stats from "../../components/Profile/UserStats";
import UserInfo from "../../components/Profile/UserInfo";
import CategoryWidgets from "../../components/Profile/CategoryWidgets";
import Header from "../../components/Profile/ProfileHeader";

function ProfilePage({onLogout}) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [monthlySpending, setMonthlySpending] = useState({});
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [categorySpending, setCategorySpending] = useState({});
  const [filterDate, setFilterDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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

  const percentageSpent =
    user && user.monthlyBudget
      ? ((monthlySpending[filterDate] || 0) / user.monthlyBudget) * 100
      : 0;

  return (
    <div className="ProfilePage">
      <Header />
      {user ? (
        <>
          <UserInfo user={user} onLogout={onLogout} />
          <Stats user={user} monthlySpending={monthlySpending} filterDate={filterDate} />
          <CategoryWidgets
            categoryBudgets={categoryBudgets}
            categorySpending={categorySpending}
          />
        </>
      ) : (
        <p className="ProfilePage__loading">Loading user data...</p>
      )}
    </div>
  );
}

export default ProfilePage;