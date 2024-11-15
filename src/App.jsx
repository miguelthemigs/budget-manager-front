import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import NavBar from "./components/NavBar/NavBar.jsx";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import ExpensePage from "./pages/ExpensePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx";
import OverviewPage from "./pages/OverviewPage";

function App() {
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userCategoryBudgets, setUserCategoryBudgets] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const userId = 1; // Assuming a fixed user ID for now
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  
  useEffect(() => {
    // Fetch User Data
    axios
      .get(`${API_BASE_URL}/user/${userId}`)
      .then((response) => setUserData(response.data))
      .catch((error) => console.error("Error fetching user data:", error));
      
    // Fetch Categories
    axios
      .get(`${API_BASE_URL}/enums/allCategories`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories", error));

    // Fetch User Category Budgets
    axios
      .get(`${API_BASE_URL}/category-budgets/user/${userId}`)
      .then((response) => setUserCategoryBudgets(response.data))
      .catch((error) =>
        console.error("Error fetching category budgets", error)
      );

    // Fetch Currencies
    axios
      .get(`${API_BASE_URL}/enums/allCurrencies`)
      .then((response) => setCurrencies(response.data))
      .catch((error) => console.error("Error fetching currencies", error));
  }, [userId]);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={<ExpensePage user={userData} categories={categories}/>}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/settings"
            element={
              <SettingsPage
                userData={userData}
                categories={categories}
                userCategoryBudgets={userCategoryBudgets}
                currencies={currencies}
                setUserCategoryBudgets={setUserCategoryBudgets}
              />
            }
          />
          <Route path="/overview" element={<OverviewPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
