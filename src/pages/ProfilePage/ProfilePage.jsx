import React, { useState, useEffect } from "react";
import "./ProfilePage.css"; // Import the CSS file
import TokenManager from "../../services/TokenManager";
import Stats from "../../components/Profile/UserStats";
import UserInfo from "../../components/Profile/UserInfo";
import CategoryWidgets from "../../components/Profile/CategoryWidgets";
import Header from "../../components/Profile/ProfileHeader";
import { fetchUserData, fetchCategoryBudgets, fetchMonthlySpending, fetchCategorySpending } from "../../services/api"; // Import API functions
function ProfilePage({ onLogout }) {
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
    const fetchData = async () => {
      try {
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [userId]);

  // Fetch category budgets directly from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgets = await fetchCategoryBudgets(userId);
        setCategoryBudgets(budgets);
      } catch (error) {
        console.error("Error fetching category budgets:", error);
      }
    };
    fetchData();
  }, [userId]);

  // Fetch monthly spending for the selected month directly from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const spending = await fetchMonthlySpending(userId, filterDate);
        setMonthlySpending((prev) => ({
          ...prev,
          [filterDate]: spending || 0,
        }));
      } catch (error) {
        console.error("Error fetching monthly spending", error);
      }
    };
    fetchData();
  }, [filterDate, userId]);

  // Fetch category spending directly from the API for each category
  useEffect(() => {
    const fetchData = async () => {
      if (categoryBudgets.length > 0) {
        const spending = await fetchCategorySpending(userId, categoryBudgets, new Date().getFullYear(), new Date().getMonth() + 1);
        setCategorySpending(spending);
      }
    };
    fetchData();
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