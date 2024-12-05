import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import "./OverviewPage.css"; // Add custom styles


// Sample data for spending
const spendingData = [
  { name: "1-7", amount: 356 },
  { name: "8-14", amount: 175 },
  { name: "15-21", amount: 200 },
  { name: "22-28", amount: 150 },
];


// Data for category breakdown
const categoryData = [
  { name: "Transfers", value: 253, color: "#007aff" },
  { name: "Groceries", value: 81, color: "#32cd32" },
  { name: "Other", value: 22, color: "#ff4500" },
];

function OverviewPage() {
  const [activeGraph, setActiveGraph] = useState("bar"); // Toggle between graphs

  // Graph rendering based on activeGraph
  const renderGraph = () => {
    if (activeGraph === "bar") {
      return (
        <BarChart width={400} height={300} data={spendingData}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="amount" fill="#ff007f" />
        </BarChart>
      );
    } else if (activeGraph === "pie") {
      return (
        <PieChart width={400} height={300}>
          <Pie
            data={categoryData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }
    return null;
  };

  return (
    <div className="OverviewPage">
      <div className="OverviewHeader">
        <h2>Spent this month: </h2>
        <div className="graph-switcher">
          <button onClick={() => setActiveGraph("bar")}>Bar Graph</button>
          <button onClick={() => setActiveGraph("pie")}>Pie Chart</button>
        </div>
      </div>
      <div className="graph-container">{renderGraph()}</div>
      <div className="category-breakdown">
        <h3>By Category</h3>
        <ul>
          {categoryData.map((item) => (
            <li key={item.name}>
              <span style={{ color: item.color }}>●</span> {item.name}: €{item.value} ({((item.value / 356) * 100).toFixed(1)}%)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OverviewPage;
