import axios from "axios";
import TokenManager from "./TokenManager";
const API_BASE_URL = "YOUR_API_BASE_URL"; // Replace with your actual base URL

export const fetchData = async (userId, setUserData, setCategories, setUserCategoryBudgets, setCurrencies) => {
  try {
    // Check if the data is already in localStorage
    const cachedData = localStorage.getItem("appData");
    if (cachedData) {
      // If cached data exists, use it
      const data = JSON.parse(cachedData);
      setUserData(data.user);
      setCategories(data.categories);
      setUserCategoryBudgets(data.budgets);
      setCurrencies(data.currencies);
    } else {
      // If no cached data, fetch from API
      const [userResponse, categoriesResponse, budgetsResponse, currenciesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/user/${userId}`),
        axios.get(`${API_BASE_URL}/enums/allCategories`),
        axios.get(`${API_BASE_URL}/category-budgets/user/${userId}`),
        axios.get(`${API_BASE_URL}/enums/allCurrencies`),
      ]);

      const data = {
        user: userResponse.data,
        categories: categoriesResponse.data,
        budgets: budgetsResponse.data,
        currencies: currenciesResponse.data,
      };

      // Save the fetched data to localStorage
      localStorage.setItem("appData", JSON.stringify(data));

      // Set state with the fetched data
      setUserData(data.user);
      setCategories(data.categories);
      setUserCategoryBudgets(data.budgets);
      setCurrencies(data.currencies);
    }
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
