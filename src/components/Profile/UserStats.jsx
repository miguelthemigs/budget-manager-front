import React from "react";
import "../../pages/ProfilePage/ProfilePage.css";
import ProgressBar from 'react-progressbar';

function Stats({ user, monthlySpending, filterDate }) {
  const percentageSpent = user?.monthlyBudget
    ? ((monthlySpending[filterDate] || 0) / user.monthlyBudget) * 100
    : 0;

  // Determine the color based on the percentage spent
  let progressColor = "#00bcd4"; // Default to blue
  if (percentageSpent >= 80) {
    progressColor = "#f44336"; // Red
  } else if (percentageSpent >= 50) {
    progressColor = "#ffeb3b"; // Yellow
  }

  return (
    <div className="ProfilePage__statsContainer">
      <h3 className="ProfilePage__statsHeading">Spending Statistics</h3>
      <div className="ProfilePage__statsInfo">
        <p className="ProfilePage__statItem">
          <span className="ProfilePage__label">Monthly Budget:</span> {user.monthlyBudget} {user.preferredCurrency}
        </p>

        <p className="ProfilePage__statItem">
          <span className="ProfilePage__label">Percentage of budget spent:</span> {percentageSpent.toFixed(2)}% (
          {monthlySpending[filterDate] || 0} {user.preferredCurrency})

          {/* Container for the progress bar and its background */}
          <div className="ProfilePage__progressContainer">
            <div className="ProfilePage__progressBackground">
              <ProgressBar
                completed={percentageSpent}
                bgcolor={progressColor}
                height="10px"
                transitionDuration="0.3s"
                labelAlignment="outside"
                width="100%"
              />
            </div>
          </div>
        </p>

        <p className="ProfilePage__statItem">
          <span className="ProfilePage__label">Left to spend this month:</span> {user.monthlyBudget - (monthlySpending[filterDate] || 0)} {user.preferredCurrency}
        </p>
      </div>
    </div>
  );
}

export default Stats;
