import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainApp from './pages/MainApp';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

    const handleLoginSuccess = () => setIsAuthenticated(true);
    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                {!isAuthenticated && (
                    <>
                        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </>
                )}
                {isAuthenticated && (
                    <Route path="/*" element={<MainApp onLogout={handleLogout} />} />
                )}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;