import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom"; // Use NavLink for navigation
import { FiSettings } from 'react-icons/fi'; // Import the settings icon from react-icons
import "./ProfilePage.css"; // Import the CSS file

function ProfilePage() {
    const [user, setUser] = useState(null);

    let userId = 1; // Example userId, you can modify this

    useEffect(() => {
        axios.get(`http://localhost:8090/user/${userId}`) 
            .then(response => {
                setUser(response.data); 
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    const handleLogout = () => {
        console.log("User logged out");
    };

    return (
        <div className="ProfilePage__container">
            <NavLink to="/settings" className="ProfilePage__settingsIcon">
                <FiSettings size={24} /> 
            </NavLink>

            <h1 className="ProfilePage__heading">Profile Page</h1>
            {user ? (
                <div>
                    <h2 className="ProfilePage__subheading">Welcome, {user.name}!</h2> 
                    <button className="ProfilePage__button" onClick={handleLogout}>Logout</button> 
                    
                    <div className="ProfilePage__statsContainer">
                        <h3 className="ProfilePage__statsHeading">Spending Statistics</h3>
                        <p className="ProfilePage__statsPlaceholder">Graph or statistics will go here.</p>
                        <p className="ProfilePage__subheading"> Monthly Budget: {user.monthlyBudget} {user.preferredCurrency} </p>
                        {/* Placeholder for future graph/statistics component */}
                    </div>
                </div>
            ) : (
                <p className="ProfilePage__loading">Loading user data...</p> 
            )}
        </div>
    );
}

export default ProfilePage;
