// services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8090"; // base URL for easier re-use

export const fetchUserData = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // rethrow error so calling components can handle it
    }
};

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/enums/allCategories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const fetchUserCategoryBudgets = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/category-budgets/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category budgets:", error);
        throw error;
    }
};