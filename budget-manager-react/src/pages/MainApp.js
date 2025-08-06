import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from '../context/NotificationContext';
import { SnackbarProvider } from '../context/SnackbarContext'; // <-- IMPORT a
import GlobalSnackbar from './components/GlobalSnackbar'; // <-- IMPORT b
import NavigationBar from './components/NavigationBar';
import DashboardPage from './DashboardPage';
import CategoriesPage from './CategoriesPage';
import BudgetsPage from './BudgetsPage';

const MainApp = ({ onLogout }) => {
    return (
        // THE FIX: We nest the providers here. SnackbarProvider wraps NotificationProvider.
        // This guarantees that any component rendered inside has access to BOTH contexts.
        <SnackbarProvider>
            <NotificationProvider>

                {/* The NavigationBar can now use both contexts if needed */}
                <NavigationBar onLogout={onLogout} />

                <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/budgets" element={<BudgetsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>

                {/* The GlobalSnackbar component lives here, at the same level as the pages */}
                <GlobalSnackbar />

            </NotificationProvider>
        </SnackbarProvider>
    );
};

export default MainApp;