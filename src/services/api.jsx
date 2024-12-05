// api.js
import axios from 'axios';
import apiClient from './ApiInterceptor';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;// Replace with your actual API base URL

export const fetchUserData = async (userId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchCategoryBudgets = async (userId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/category-budgets/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category budgets:", error);
    throw error;
  }
};


export const fetchMonthlySpending = async (userId, filterDate) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/expenses/monthly`, {
      params: { userId, month: filterDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly spending", error);
    throw error;
  }
};

// Fetch category spending
export const fetchCategorySpending = async (userId, categoryBudgets, year, month) => {
  const updatedSpending = {};
  for (const budget of categoryBudgets) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/expenses/categoryBudget`, {
        params: {
          userId,
          category: budget.category,
          year,
          month,
        },
      });
      updatedSpending[budget.category] = response.data;
    } catch (error) {
      console.error(`Error fetching spending for category ${budget.category}:`, error);
    }
  }
  return updatedSpending;
};
