import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import NavBar from "./components/NavBar/NavBar.jsx";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import ExpensePage from "./pages/ExpensePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx";
import OverviewPage from "./pages/OverviewPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userCategoryBudgets, setUserCategoryBudgets] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const userId = 1; // Assuming a fixed user ID for now
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // useEffect(() => {
  //   axios
  //     .get(`${API_BASE_URL}/user/${userId}`)
  //     .then((response) => setUserData(response.data))
  //     .catch((error) => console.error("Error fetching user data:", error));

  //   axios
  //     .get(`${API_BASE_URL}/enums/allCategories`)
  //     .then((response) => setCategories(response.data))
  //     .catch((error) => console.error("Error fetching categories", error));

  //   axios
  //     .get(`${API_BASE_URL}/category-budgets/user/${userId}`)
  //     .then((response) => setUserCategoryBudgets(response.data))
  //     .catch((error) =>
  //       console.error("Error fetching category budgets", error)
  //     );

  //   axios
  //     .get(`${API_BASE_URL}/enums/allCurrencies`)
  //     .then((response) => setCurrencies(response.data))
  //     .catch((error) => console.error("Error fetching currencies", error));
  // }, [userId]);

  const handleLogin = async (user) => {
  setIsAuthenticated(true);
  setUserData(user);

  // Fetch additional data after login
  try {
    const categoriesResponse = await axios.get(`${API_BASE_URL}/enums/allCategories`);
    setCategories(categoriesResponse.data);

    const budgetsResponse = await axios.get(`${API_BASE_URL}/category-budgets/user/${user.id}`);
    setUserCategoryBudgets(budgetsResponse.data);

    const currenciesResponse = await axios.get(`${API_BASE_URL}/enums/allCurrencies`);
    setCurrencies(currenciesResponse.data);
  } catch (error) {
    console.error("Error fetching data after login", error);
  }
};


  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          {/* Unprotected routes */}
          <Route
            path="/login"
            element={<LoginPage onLogin={(data) => console.log(data)} />}
          />
          <Route
            path="/register"
            element={<RegistrationPage onRegister={(data) => console.log(data)} />}
          />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={<ProtectedRoute element={() => <ExpensePage user={userData} categories={categories} />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={ProfilePage} />}
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute
                element={() => (
                  <SettingsPage
                    userData={userData}
                    categories={categories}
                    userCategoryBudgets={userCategoryBudgets}
                    currencies={currencies}
                    setUserCategoryBudgets={setUserCategoryBudgets}
                  />
                )}
                roles={["USER", "ADMIN"]}
              />
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute
                element={OverviewPage}
                roles={["ADMIN"]}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
