import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';

function DemoPage(){
        const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/expenses?userId=1') // Replace with your Spring Boot API URL
            .then(response => {
                setData(response.data); // Assuming response.data is an array of expense objects
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setData([]); // Set to empty array or handle error as needed
            });
    }, []);

    return (
        <div>
            <h1>Data from Spring Boot - Getting All Expenses from user with id 1:</h1>
            {data.length > 0 ? (
                <ul>
                    {data.map(expense => (
                        <li key={expense.id}>
                            <strong>Category:</strong> {expense.category}<br />
                            <strong>Description:</strong> {expense.description}<br />
                            <strong>Amount:</strong> ${expense.amount}<br />
                            <strong>Date:</strong> {expense.date}<br />
                            <strong>User ID:</strong> {expense.userId}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No expenses found.</p>
            )}
        </div>
    );
}

export default DemoPage;
