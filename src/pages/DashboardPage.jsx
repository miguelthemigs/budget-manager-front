import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../services/ApiInterceptor";
import "./DashboardPage.css";
import TokenManager from "../services/TokenManager";

function DashboardPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

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

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        // Check if the user is trying to delete themselves
        if (userId === TokenManager.getUserId()) {
            toast.error("You cannot delete your own account.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            await apiClient.delete(`/user/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            toast.success("User deleted successfully.", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (err) {
            toast.error("Failed to delete user. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            {error && <p className="dashboard-error">{error}</p>}

            <ToastContainer /> {/* Add ToastContainer for notifications */}

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
