# Budget Manager Application (Front-End)

## Overview  
Budget Manager is a web application designed to help users manage their finances efficiently. With a clean, responsive interface and powerful features, it provides users with tools to track expenses, analyze spending habits, and manage budgets. The application is built using **React** for the frontend and **Spring Boot** for the backend, with data persisted in a **PostgreSQL** database. 

Key features include role-based access control, insightful visualizations powered by **Recharts**, and seamless deployment using **Docker** and **GitHub Actions** for CI/CD.

---

## Features  

### User Authentication & Role-Based Access Control  
- **Register and Log In**: Secure authentication for all users.  
- **User Roles**:  
  - **User**: Access personal dashboards, manage expenses, and budgets.  
  - **Admin**: Access admin dashboard to view and manage user roles.

![image](https://github.com/user-attachments/assets/05fea728-2f9f-4cf5-bf3f-dd21ecb84f87)

(this dashboard is only avaliable to users with *admin* role)


### Expense Management  
- **Add Expenses**: Log your expenses with details and categories.  
- **Filter by Month**: View and analyze expenses for specific time periods.  
- **Category Budgets**: Set and edit budgets for different expense categories.
![image](https://github.com/user-attachments/assets/eb3e9b0b-153f-404d-a094-84c7ef35e9d6)

### Insights and Visualizations  
- **Overview Page**:  
  - Analyze spending habits with date filtering options.  
  - Interactive charts and graphs powered by **Recharts**.
![image](https://github.com/user-attachments/assets/1ad3da11-3052-4a9a-a148-5e736980a8cf)

- **Profile Page**:  
  - Detailed insights into spending habits.  
  - Graphs and analytics on spending by category and budgets.
![image](https://github.com/user-attachments/assets/66089f24-b309-40c1-8214-875ed391d98e)

### User Settings  
- Update profile details.  
- Add or edit category budgets for more personalized financial tracking.  

---

## Technical Details  

### Frontend  
- **Framework**: React.js  
- **Charts Library**: Recharts  
- **State Management**: SessionStorage for token management.  

### Backend  
- **Framework**: Spring Boot (Java)  
- **Database**: PostgreSQL (Dockerized)  

### DevOps  
- **Hosting**: Backend and database hosted in Docker for ease of sharing and deployment.  
- **CI/CD**: GitHub Actions for continuous integration and deployment.  
- **Code Quality**: SonarQube for static code analysis and test coverage.  

---
You can find the back-end here: https://github.com/miguelthemigs/budget-manager

## Installation and Setup  

### Prerequisites  
- Docker installed on your machine.  
- Node.js and npm for running the frontend.  
- Java (JDK 17+) for backend development.  

### Steps  
1. **Clone the Repository**:  
    ```bash  
    git clone https://github.com/miguelthemigs/budget-manager-front
    cd budget-manager  
    ```  

2. **Backend Setup**:  
    - Navigate to the backend directory and build the project:  
        ```bash  
        ./gradlew clean install  
        ```  
    - Start the backend using Docker:  
        ```bash  
        docker-compose up --build -d
        ```  

3. **Frontend Setup**:  
    - Navigate to the frontend directory:  
        ```bash  
        cd frontend  
        ```  
    - Install dependencies:  
        ```bash  
        npm install  
        ```  
    - Start the application:  
        ```bash  
        npm run dev  
        ```  

4. **Access the Application**:  
    Open your browser and navigate to `http://localhost:5173`.  
