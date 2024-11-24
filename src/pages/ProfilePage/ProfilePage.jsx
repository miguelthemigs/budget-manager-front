import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom"; // Use NavLink for navigation
import { FiSettings } from 'react-icons/fi'; // Import the settings icon from react-icons
import "./ProfilePage.css"; // Import the CSS file
import TokenManager from "../../services/TokenManager";
import apiClient from '../../services/ApiInterceptor';

function ProfilePage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [user, setUser] = useState(null);
    const [monthlySpending, setMonthlySpending] = useState({});
    const [filterDate, setFilterDate] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      });

      const userId = TokenManager.getUserId(); 

     // Fetch monthly spending for the selected month
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
  }, [filterDate, userId, user?.monthlyBudget]);

    useEffect(() => {
        apiClient.get(`${API_BASE_URL}/user/${userId}`) 
            .then(response => {
                setUser(response.data); 
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    const handleLogout = () => {
        console.log("User logged out");
    };

    const percentageSpent = user && user.monthlyBudget
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
                    <button className="ProfilePage__button" onClick={handleLogout}>Logout</button> 
                    
                    <div className="ProfilePage__statsContainer">
                        <h3 className="ProfilePage__statsHeading">Spending Statistics</h3>
                        <p className="ProfilePage__statsPlaceholder">Graph or statistics will go here.</p>
                        <p className="ProfilePage__subheading"> Monthly Budget: {user.monthlyBudget} {user.preferredCurrency} </p>
                        <h4 className="ProfilePage__subheading"> Percentage of budget spent: {percentageSpent.toFixed(2)}% (
                          {monthlySpending[filterDate] || 0} {user.preferredCurrency})</h4>
                        <h3 className="ProfilePage__heading"> Left to spend this month: {user.monthlyBudget - (monthlySpending[filterDate] || 0)} {user.preferredCurrency} </h3>
                        
                    </div>
                </div>
            ) : (
                <p className="ProfilePage__loading">Loading user data...</p> 
            )}
        </div>
    );
}

export default ProfilePage;
