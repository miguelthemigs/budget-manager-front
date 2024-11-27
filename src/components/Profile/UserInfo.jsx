import React from "react";
import "../../pages/ProfilePage/ProfilePage.css";

function UserInfo({ user, onLogout }) {
  return (
    <div>
      <h2 className="ProfilePage__subheading">Welcome, {user.name}!</h2>
      <button className="ProfilePage__button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default UserInfo;
