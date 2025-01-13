import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../services/ApiInterceptor";
import "./DashboardPage.css";
import { fetchAllUsers } from "../services/api";
import TokenManager from "../services/TokenManager";
import UserDetailsForm from "../components/Settings/UserDetailsForm";
import EditUserModal from "../components/Dashboard/EditUserModal"; // Import the renamed modal component
import { FaTrash, FaEdit } from "react-icons/fa"; // Importing the icons

function DashboardPage({currencies}) {
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {  
        const fetchUsers = async () => {
            try {
                const users = await fetchAllUsers();
                setUsers(users);
            } catch (error) {
                setError("Failed to fetch users. Please try again.");
            }
        };
        fetchUsers();
    }, []);

    const handleEditUser = (user) => {
        setIsEditing(true);
        setSelectedUser(user); // Set the user to edit
    };

    const handleUpdateUserDetails = async (updatedUser) => {
        try {
            await apiClient.put(`/user/${updatedUser.id}`, updatedUser);
            setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
            toast.success("User details updated successfully.");
            setIsEditing(false); // Close the form after update
        } catch (err) {
            toast.error("Failed to update user details. Please try again.");
        }
    };

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
    
          <ToastContainer />
    
          {isEditing && selectedUser && (
            <EditUserModal onClose={() => setIsEditing(false)}>
              <UserDetailsForm
                name={selectedUser.name}
                setName={(value) => setSelectedUser({ ...selectedUser, name: value })}
                currency={selectedUser.preferredCurrency}
                setCurrency={(value) => setSelectedUser({ ...selectedUser, preferredCurrency: value })}
                monthlyBudget={selectedUser.monthlyBudget}
                setMonthlyBudget={(value) => setSelectedUser({ ...selectedUser, monthlyBudget: value })}
                email={selectedUser.email}
                setEmail={(value) => setSelectedUser({ ...selectedUser, email: value })}
                currencies={currencies} // Example list of currencies
                onSave={() => handleUpdateUserDetails(selectedUser)}
              />
            </EditUserModal>
          )}
    
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id} className="user-item">
                <span>{user.name} {user.lastName} ({user.email})</span>
                <span>{user.role}</span>
                <button
                  className="edit-button"
                  onClick={() => handleEditUser(user)}
                >
                  <FaEdit />
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default DashboardPage;
