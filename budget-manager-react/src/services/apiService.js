import axios from 'axios';

// Create an axios instance with a base URL and default headers.
// The "proxy" in package.json handles directing this to http://localhost:8080
const apiClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/v1`
});

/**
 * AXIOS INTERCEPTOR
 * This is a powerful feature of Axios. It's a piece of code that runs
 * BEFORE every single request is sent from our frontend.
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- AUTHENTICATION APIS ---
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);

// --- CATEGORY APIS ---
export const getCategories = () => apiClient.get('/categories');
export const createCategory = (categoryData) => apiClient.post('/categories', categoryData);
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);

// --- TRANSACTION APIS ---
// We accept year and month to pass as query parameters
export const getTransactions = (year, month) => apiClient.get('/transactions', {params: {year, month}});
export const createTransaction = (transactionData) => apiClient.post('/transactions', transactionData);
export const deleteTransaction = (id) => apiClient.delete(`/transactions/${id}`);

// --- BUDGET APIS ---
export const getBudgets = (year, month) => apiClient.get('/budgets', {params: {year, month}});
export const setBudget = (budgetData) => apiClient.post('/budgets', budgetData);

// --- NOTIFICATION APIS ---
export const getNotifications = () => apiClient.get('/notifications');
export const markNotificationAsRead = (id) => apiClient.post(`/notifications/${id}/mark-as-read`);

// --- DASHBOARD API ---
export const getDashboardSummary = (year, month) => apiClient.get('/transactions/dashboard', {params: {year, month}});


export default apiClient;