import React from "react";
import { NavLink } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import "../../pages/ProfilePage/ProfilePage.css";

function Header() {
  return (
    <div className="Header">
      <NavLink to="/settings" className="ProfilePage__settingsIcon">
        <FiSettings size={24} />
      </NavLink>
      <h1 className="ProfilePage__heading">My Profile</h1>
    </div>
  );
}

export default Header;
