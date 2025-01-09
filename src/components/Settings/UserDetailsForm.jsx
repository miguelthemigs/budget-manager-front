import React from 'react';

const UserDetailsForm = ({
  name,
  setName,
  currency,
  setCurrency,
  monthlyBudget,
  setMonthlyBudget,
  email,
  setEmail,
  currencies,
  onSave,
}) => {
    // Default currencies to an empty array if it's undefined
    const safeCurrencies = currencies || [];

  return (
    <form className="SettingsPage__form" onSubmit={onSave}>
      <label className="SettingsPage__label">Name:</label>
      <input
        type="text"
        className="SettingsPage__input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label className="SettingsPage__label">Email:</label>
      <input
        type="email"
        className="SettingsPage__input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label className="SettingsPage__label">Preferred Currency:</label>
      <select
        className="SettingsPage__currencySelect"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        required
      >
        <option value="">Select a currency</option>
        {safeCurrencies.map((curr, index) => (
          <option key={index} value={curr}>
            {curr}
          </option>
        ))}
      </select>
      <label className="SettingsPage__label">Monthly Budget:</label>
      <input
        type="number"
        className="SettingsPage__input"
        value={monthlyBudget}
        onChange={(e) => setMonthlyBudget(e.target.value)}
        required
      />
      <button className="SettingsPage__button" type="submit">
        Save
      </button>
    </form>
  );
};

export default UserDetailsForm;
