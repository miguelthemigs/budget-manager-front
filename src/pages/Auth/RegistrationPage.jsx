import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css"; // Adjust the path if needed
import RegistrationForm from "../../components/Auth/RegistrationForm";

function RegistrationPage({ onRegister }) {
  return (
    <div className="auth-container">
      <h2>Register</h2>
      <RegistrationForm onRegister={onRegister} />
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegistrationPage;
