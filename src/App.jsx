import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import NavBar from "./components/NavBar/NavBar.jsx";
import ExpensePage from "./pages/ExpensePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/Auth/LoginPage";
import OverviewPage from "./pages/Overview/OverviewPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import TokenManager from "./services/TokenManager";
import { fetchData, handleLogin } from "./services/DataService.jsx";

function App() {
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userCategoryBudgets, setUserCategoryBudgets] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const rehydrateUser = async () => {
    if (TokenManager.getAccessToken() && !TokenManager.isTokenExpired()) {
      const userId = TokenManager.getUserId();
      await fetchData(
        userId,
        setUserData,
        setCategories,
        setUserCategoryBudgets,
        setCurrencies
      );
      setIsAuthenticated(true);
    } else {
      TokenManager.clear();
    }
  };

  // Call rehydrateUser on component mount
  useEffect(() => {
    rehydrateUser();
  }, []);
  // Function to handle logout and clear cache
  const handleLogout = () => {
    TokenManager.clear();
    localStorage.removeItem("appData");
    setUserData(null);
    setCategories([]);
    setUserCategoryBudgets([]);
    setCurrencies([]);
    setIsAuthenticated(false);
  };

  return (
    <div className="main-content">
      <Router>
        {isAuthenticated && <NavBar onLogout={handleLogout} />}
        <Routes>
          {/* Unprotected routes */}
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={() =>
                  handleLogin(
                    setIsAuthenticated,
                    setUserData,
                    setIsAdmin,
                    setUserData,
                    setCategories,
                    setUserCategoryBudgets,
                    setCurrencies
                  )
                }
              />
            }
          />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={() => (
                  <ExpensePage user={userData} categories={categories} />
                )}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                element={() => <ProfilePage onLogout={handleLogout} />}
              />
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute
                element={() => <OverviewPage />}
              />
            }
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
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute element={DashboardPage} roles={["ADMIN"]} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
