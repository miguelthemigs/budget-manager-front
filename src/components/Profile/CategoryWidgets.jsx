import React from "react";
import "../../pages/ProfilePage/ProfilePage.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function CategoryWidgets({ categoryBudgets, categorySpending }) {
  return (
    <div className="ProfilePage__widgets">
      {categoryBudgets.map((budget) => {
        const spending = categorySpending[budget.category] || 0;
        const percentageSpent = Math.min(
          ((spending / budget.budget_amount) * 100).toFixed(2),
          100
        ); // Cap at 100% for overflow handling

        // Determine color based on the percentage spent
        let pathColor = "#00bcd4"; // default to blue
        if (percentageSpent >= 80) {
          pathColor = "#f44336"; // red
        } else if (percentageSpent >= 50) {
          pathColor = "#ffeb3b"; // yellow
        }

        return (
          <div className="ProfilePage__widget" key={budget.category}>
            <h4>{budget.category}</h4>
            <div style={{ width: "70%", margin: "0 auto" }}>
              <CircularProgressbar
                value={percentageSpent}
                text={`${percentageSpent}%`}
                styles={buildStyles({
                  textSize: "12px",
                  pathColor: pathColor, // Conditional path color
                  textColor: "#ffffff",
                  trailColor: "#2a2a2a",
                  backgroundColor: "#2a2a2a",
                })}
              />
            </div>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              {spending} / {budget.budget_amount}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryWidgets;
