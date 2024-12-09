import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./OverviewPage.css"; // Add custom styles
import { fetchMonthlySpending, fetchMonthlyExpenses, fetchUserData } from "../../services/api";
import TokenManager from "../../services/TokenManager";

function OverviewPage() {
  const userId = TokenManager.getUserId();
  const [monthlySpending, setMonthlySpending] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryData, setCategoryData] = useState([]);
  const [preferredCurrency, setPreferredCurrency] = useState("");
  const [periodData, setPeriodData] = useState([]);
  const [filterDate, setFilterDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    setFilterDate(`${year}-${month}`);
  }, [selectedDate]);

  useEffect(() => {
    if (!userId || !filterDate) return;

    const getMonthlyExpenses = async () => {
      try {
        const response = await fetchMonthlyExpenses(
          userId,
          filterDate.split("-")[1],
          filterDate.split("-")[0]
        );
        if (response && Array.isArray(response)) {
          const categorizedExpenses = categorizeByCategory(response);
          setCategoryData(categorizedExpenses);
          const periodExpenses = categorizeByPeriod(response);
          setPeriodData(periodExpenses);
        } else {
          console.error("Invalid response data:", response);
        }
      } catch (error) {
        console.error("Error fetching monthly expenses", error);
      }
    };

    getMonthlyExpenses();
  }, [userId, filterDate]);

  useEffect(() => {
    if (!userId) return;
    const getPreferredCurrency = async () => {
      try {
        const userData = await fetchUserData(userId);
        setPreferredCurrency(userData.preferredCurrency);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getPreferredCurrency();
  }, [userId]);

  // Categorize expenses based on categories (e.g., groceries, transportation, etc.)
  const categorizeByCategory = (expenses) => {
    const categorized = {};

    expenses.forEach((expense) => {
      if (expense && expense.category) {
        if (!categorized[expense.category]) {
          categorized[expense.category] = 0;
        }
        categorized[expense.category] += expense.amount || 0;
      } else {
        console.warn("Skipping invalid expense:", expense);
      }
    });

    // Convert the categorized data to an array format that Recharts expects
    return Object.keys(categorized).map((category) => ({
      name: category,
      amount: categorized[category],
    }));
  };

  // Categorize expenses by the 5 periods of the month 
  const categorizeByPeriod = (expenses) => {
    const categorized = {
      "1-7": 0,
      "8-14": 0,
      "15-21": 0,
      "22-28": 0,
      "29-31": 0,
    };

    expenses.forEach((expense) => {
      if (expense && expense.date) {
        const date = new Date(expense.date);
        const day = date.getDate();

        if (day >= 1 && day <= 7) {
          categorized["1-7"] += expense.amount || 0;
        } else if (day >= 8 && day <= 14) {
          categorized["8-14"] += expense.amount || 0;
        } else if (day >= 15 && day <= 21) {
          categorized["15-21"] += expense.amount || 0;
        } else if (day >= 22 && day <= 28) {
          categorized["22-28"] += expense.amount || 0;
        } else {
          categorized["29-31"] += expense.amount || 0;
        }
      } else {
        console.warn("Skipping invalid expense:", expense);
      }
    });

    return [
      { name: "1-7", amount: categorized["1-7"] },
      { name: "8-14", amount: categorized["8-14"] },
      { name: "15-21", amount: categorized["15-21"] },
      { name: "22-28", amount: categorized["22-28"] },
      { name: "29-31", amount: categorized["29-31"] },
    ];
  };

  useEffect(() => {
    if (!userId || !filterDate) return;

    const getMonthlySpending = async () => {
      try {
        const spending = await fetchMonthlySpending(userId, filterDate);
        setMonthlySpending((prev) => ({
          ...prev,
          [filterDate]: spending || 0,
        }));
      } catch (error) {
        console.error("Error fetching monthly spending:", error);
      }
    };

    getMonthlySpending();
  }, [userId, filterDate]);

  // Calculate total spending for the month (for percentage calculation)
  const totalSpending = categoryData.reduce((total, category) => total + category.amount, 0);

  return (
    <div className="OverviewPage">
      <div className="OverviewHeader">
        <h2>
          Spent this month:{" "}
          {typeof monthlySpending[filterDate] === "number"
            ? monthlySpending[filterDate]
            : 0}{" "}
            {preferredCurrency}
        </h2>
        <div className="month-picker">
          <label>Select Month: </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </div>
      </div>
      <div className="graphs-container">
        <div className="bar-chart">
        <h3>Weekly Spending</h3>
          <BarChart width={570} height={450} data={periodData}>
          <XAxis dataKey="name" stroke="#ccc" label={{ value: "Days of the Month", position: "insideBottom", offset: -3 }} />
          <YAxis stroke="#ccc" label={{ value: `Value (${preferredCurrency})`, angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value) => `${value} ${preferredCurrency}`} />
            <Bar dataKey="amount" fill="#ff007f" />
          </BarChart>
        </div>
        <div className="pie-chart">
          <h3>Spending by Category</h3>
          <PieChart width={650} height={400}>
            <Pie
              data={categoryData}
              dataKey="amount"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => {
                console.log("Category:", entry.name); // Log category name for debugging
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={getCategoryColor(entry.name)}
                  />
                );
              })}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

// Optional: Customize colors based on categories
const getCategoryColor = (name) => {
 // Normalize the category name (convert to uppercase and trim spaces)
 const normalizedCategory = name.trim().toUpperCase();

 const colors = {
  GROCERIES: "#4C9EBF",        // Muted Blue
  SHOPPING: "#F1A533",         // Soft Yellow-Orange
  ENTERTAINMENT: "#7F5AA2",    // Muted Purple
  HEALTH: "#4F9A7B",           // Muted Green
  TRANSFERS: "#6B8E8C",        // Dusty Teal
  RESTAURANTS: "#FF6F61",      // Coral Red
  TRAVEL: "#2E91B7",           // Deep Sky Blue
  TRANSPORTATION: "#3F8C4F",   // Dark Olive Green
  UTILITIES: "#6A6A6A",        // Dark Gray
  SERVICES: "#9A88C4",         // Soft Lavender
  INVESTMENTS: "#3F4A6D",      // Slate Blue
  DONATION: "#8B9F30",         // Olive Green
  SALARY: "#6A4E3D",           // Earthy Brown
  GIFTS: "#F1C40F",            // Sunflower Yellow
  INSURANCE: "#5D6D7E",        // Muted Steel Blue
  SUBSCRIPTIONS: "#7F8C8D",    // Slate Gray
  REFUND: "#2980B9",           // Bright Blue
  OTHER: "#9B59B6",            // Amethyst Purple          
  };
  
  
 return colors[normalizedCategory] || "#8884d8"; // Default color if no match
};

export default OverviewPage;
