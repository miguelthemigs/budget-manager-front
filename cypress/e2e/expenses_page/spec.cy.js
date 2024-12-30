
describe('Add Expense', () => {
  it('logs in, waits for requests, and adds an expense', () => {
    // Intercept the necessary API calls
    cy.intercept('GET', '**/expenses/monthly*').as('getMonthlyExpenses');
    cy.intercept('GET', '**/expenses/perMonth*').as('getPerMonthExpenses');
    cy.intercept('GET', '**/enums/allCategories').as('getAllCategories');
    cy.intercept('GET', '**/enums/allCurrencies').as('getAllCurrencies');
    cy.intercept('GET', '**/category-budgets/user/*').as('getCategoryBudgets');

    // Visit the login page and log in
    cy.visit('http://localhost:5173/login');
    cy.get('[data-cy="email_input"]').type('mig.roale@gmail.com'); // Replace with actual selector
    cy.get('[data-cy="password_input"]').type('12345'); // Replace with actual selector
    cy.get('[data-cy="login_button"]').click(); // Replace with actual selector

    // Wait for navigation and API requests
    cy.url().should('not.include', '/login'); // Confirm login

    cy.reload();

    cy.wait('@getMonthlyExpenses'); // Wait for the first request
    cy.wait('@getPerMonthExpenses'); // Wait for the second request
    cy.wait('@getAllCategories'); // Wait for categories
    cy.wait('@getAllCurrencies'); // Wait for currencies
    cy.wait('@getCategoryBudgets'); // Wait for budgets

    // Navigate to the Add Expense form
    cy.visit('http://localhost:5173/'); // Update if needed

    // Fill in the form
    cy.wait(300)
    cy.get('[data-cy="date_input"]').type('2024-12-31');
    cy.get('[data-cy="category_input"]').select('RESTAURANTS');
    cy.get('[data-cy="description_input"]').type('Dinner with friends');
    cy.get('[data-cy="amount_input"]').type('50.75');
    cy.get('[data-cy="submit_button"]').click();

    // Wait for post-submission API updates (if any, like reloading expenses)
    cy.wait('@getMonthlyExpenses');
    cy.wait('@getPerMonthExpenses');

    // Validate the expense was added
    cy.contains('Dinner with friends'); // Check if the new expense appears
  });
});
