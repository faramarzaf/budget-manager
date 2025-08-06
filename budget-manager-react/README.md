# Full-Stack Budget Manager with Smart Notifications

This is a comprehensive, full-stack personal finance application designed to showcase a modern, enterprise-grade technology stack and architecture. The application allows users to securely manage their income and expenses, set monthly budgets, and receive smart notifications about their spending habits.

The entire project is containerized with Docker, allowing for a simple, one-command setup.

## Key Features

*   **Secure User Authentication:** Full registration and login flow using JWT (JSON Web Tokens) for secure, stateless authentication.
*   **Transaction Management:** Complete CRUD (Create, Read, Update, Delete) functionality for income and expense transactions.
*   **Category Management:** Users can create and manage their own custom spending and income categories.
*   **Monthly Budgeting:** Set monthly spending limits for any expense category.
*   **Smart Notifications (Backend):** A scheduled background job runs periodically to check if spending has crossed a budget threshold (e.g., 75%, 90%) and automatically creates a notification.
*   **Interactive Dashboard:** A rich, single-page dashboard that displays:
    *   Total income, expenses, and net balance.
    *   A visual pie chart of spending by category.
    *   A detailed list of recent transactions.
*   **Real-time Notification UI:** A navigation bar icon that polls for new notifications and displays them to the user in real-time.

## Technology Stack

### Backend
*   **Language:** Java 21
*   **Framework:** Spring Boot 3
*   **Security:** Spring Security (JWT-based)
*   **Database:** PostgreSQL
*   **Data Access:** Spring Data JPA / Hibernate
*   **Scheduled Tasks:** Spring Scheduler (`@Scheduled`)

### Frontend
*   **Library:** React 18
*   **UI Components:** Material-UI (MUI) v5
*   **State Management:** React Hooks (useState, useEffect, useCallback, useContext)
*   **Routing:** React Router v6
*   **API Communication:** Axios
*   **Charting:** Recharts

### DevOps
*   **Containerization:** Docker & Docker Compose

## Getting Started

### Prerequisites
*   Docker and Docker Compose must be installed on your local machine.

### Running the Application
1.  Clone the repository to your local machine.
2.  Navigate to the root directory of the project (the folder containing `docker-compose.yml`).
3.  Run the following command in your terminal:

    ```bash
    docker-compose up --build
    ```
4.  The command will build the Docker images for both the backend and frontend, and start all the necessary containers.
5.  Once the build is complete and the containers are running:
    *   The **React frontend** will be available at `http://localhost:3000`.
    *   The **Java backend API** will be available at `http://localhost:8080`.

---