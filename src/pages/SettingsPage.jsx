import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SettingsPage.css"; // Import the CSS file

function SettingsPage() {
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("");
    const [monthlyBudget, setMonthlyBudget] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState(null);
    const [categoryBudgets, setCategoryBudgets] = useState([]);

    const userId = 1; // Example userId, you can modify this

    useEffect(() => {
        // Fetch user data from the API (replace with your actual API call)
        axios.get(`http://localhost:8090/user/${userId}`)
            .then(response => {
                const userData = response.data;
                console.log(response.data);
                setName(userData.name);
                setCurrency(userData.preferredCurrency);
                setMonthlyBudget(userData.monthlyBudget);
                setEmail(userData.email);
                setId(userData.id);

            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
            
    }, []);

    const handleSave = async (event) => {
        event.preventDefault();
    
        const updatedData = { 
            name, 
            preferredCurrency: currency,  
            monthlyBudget: parseFloat(monthlyBudget), 
            email,
        };
    
        try {
            console.log("Updated data:", updatedData);
    
            const response = await axios.patch(`http://localhost:8090/user/${userId}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json', // Ensure JSON is sent
                }
            });
    
            alert("User details updated successfully!");
            
    
        } catch (error) {
            console.error("Error updating user data:", error);
            alert("Error updating user data: " + error.message);
        }
    };


    const handleAddCategoryBudget = () => {
        // Logic for adding new category budget (to be implemented)
        console.log("Add Category Budget button clicked");
    };

    return (
        <div className="SettingsPage__container">
            <h1 className="SettingsPage__heading">Settings</h1>
            <p>Update details:</p>
            <form className="SettingsPage__form" onSubmit={handleSave}>
                
                <div>
                    <label className="SettingsPage__label">Name</label>
                    <input
                        type="text"
                        className="SettingsPage__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="SettingsPage__label">Preferred Currency</label>
                    <input
                        type="text"
                        className="SettingsPage__input"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    />
                </div>

                <div>
                    <label className="SettingsPage__label">Monthly Budget</label>
                    <input
                        type="number"
                        className="SettingsPage__input"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                    />
                </div>

                <div>
                    <label className="SettingsPage__label">Email</label>
                    <input
                        type="email"
                        className="SettingsPage__input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button type="submit" className="SettingsPage__button">Save</button>
            </form>

            <div className="SettingsPage__categorySection">
                <h3>Category Budgets</h3>
                {/* Add category budgets dynamically */}
                {categoryBudgets.map((budget, index) => (
                    <div key={index}>
                        <label className="SettingsPage__label">Category {index + 1}</label>
                        <input
                            type="text"
                            className="SettingsPage__input"
                            value={budget}
                            onChange={(e) => {
                                const newBudgets = [...categoryBudgets];
                                newBudgets[index] = e.target.value;
                                setCategoryBudgets(newBudgets);
                            }}
                        />
                    </div>
                ))}
                <button 
                    className="SettingsPage__categoryButton"
                    onClick={handleAddCategoryBudget}
                >
                    Add Category Budget
                </button>
            </div>
        </div>
    );
}

export default SettingsPage;
