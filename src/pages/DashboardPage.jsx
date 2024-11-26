import React, { useState, useEffect } from "react";
import apiClient from  "../services/ApiInterceptor"; // Import the centralized API client
import "./DashboardPage.css";

function DashboardPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiClient.get("/user/all");
                setUsers(response.data);
            } catch (err) {
                setError("Failed to fetch users. Please try again.");
            }
        };

        fetchUsers();
    }, []);

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await apiClient.delete(`/user/${userId}`);
            setUsers(users.filter(user => user.id !== userId)); // Update the UI
        } catch (err) {
            setError("Failed to delete user. Please try again.");
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            {error && <p className="dashboard-error">{error}</p>}
            <ul className="user-list">
                {users.map(user => (
                    <li key={user.id} className="user-item">
                        <span>{user.firstName} {user.lastName} ({user.email})</span>
                        <span>{user.role}</span>
                        <button 
                            className="delete-button" 
                            onClick={() => handleDeleteUser(user.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DashboardPage;
