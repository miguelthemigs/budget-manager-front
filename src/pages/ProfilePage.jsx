import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css"; // Import the new CSS file

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [monthlyBudget, setMonthlyBudget] = useState(null);

    let userId = 1; // Example userId, you can modify this

    useEffect(() => {
        // Fetch user data (you can replace the URL with your actual endpoint)
        axios.get(`http://localhost:8090/user/${userId}`) // Adjust the endpoint as necessary
            .then(response => {
                setUser(response.data); // Assuming response.data contains user information
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    useEffect(() => {
        
    }, [user]); // Add dependencies as needed

    const handleLogout = () => {
        // Handle logout logic here (e.g., clear auth tokens, redirect, etc.)
        console.log("User logged out");
        // Optionally redirect to login page or perform other actions
    };

    return (
        <div className="ProfilePage__container">
            <h1 className="ProfilePage__heading">Profile Page</h1>
            {user ? (
                <div>
                    <h2 className="ProfilePage__subheading">Welcome, {user.name}!</h2> {/* Display user name */}
                    <button className="ProfilePage__button" onClick={handleLogout}>Logout</button> {/* Logout button */}
                    
                    <div className="ProfilePage__statsContainer">
                        <h3 className="ProfilePage__statsHeading">Spending Statistics</h3>
                        <p className="ProfilePage__statsPlaceholder">Graph or statistics will go here.</p>
                        <p className="ProfilePage__subheading"> Monthly Budget: {user.monthlyBudget} {user.preferredCurrency} </p>
                        {/* Placeholder for future graph/statistics component */}
            
                    </div>
                </div>
            ) : (
                <p className="ProfilePage__loading">Loading user data...</p> // Loading state
            )}
        </div>
    );
}

export default ProfilePage;
