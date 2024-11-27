import axios from "axios";
import TokenManager from "./TokenManager";
import apiClient from "./ApiInterceptor";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;; // Replace with your actual base URL

export const fetchData = async (userId, setUserData, setCategories, setUserCategoryBudgets, setCurrencies) => {
  try {
    // Fetch data directly from the API
    const [userResponse, categoriesResponse, budgetsResponse, currenciesResponse] = await Promise.all([
      apiClient.get(`${API_BASE_URL}/user/${userId}`),
      apiClient.get(`${API_BASE_URL}/enums/allCategories`),
      apiClient.get(`${API_BASE_URL}/category-budgets/user/${userId}`),
      apiClient.get(`${API_BASE_URL}/enums/allCurrencies`),
    ]);

    const data = {
      user: userResponse.data,
      categories: categoriesResponse.data,
      budgets: budgetsResponse.data,
      currencies: currenciesResponse.data,
    };
    console.log("Fetched data:", currenciesResponse.data);

    // Set state with the fetched data
    setUserData(data.user);
    setCategories(data.categories);
    setUserCategoryBudgets(data.budgets);
    setCurrencies(data.currencies);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const handleLogin = async (setIsAuthenticated, setIsAdmin, fetchData, setUserData) => {
  const userId = TokenManager.getUserId(); // Retrieve userId after login
  const role = TokenManager.getUserRole(); // Retrieve user role after login
  console.log("User role", role);
  if (userId) {
    setIsAuthenticated(true);
    await fetchData(userId, setUserData); // Fetch all data
  }
  if (role === "ADMIN") {
    setIsAdmin(true);
  }
};
