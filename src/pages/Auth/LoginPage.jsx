import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import LoginForm from "../../components/Auth/LoginForm";

function LoginPage({ onLogin }) {
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <LoginForm onLogin={onLogin} />
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
