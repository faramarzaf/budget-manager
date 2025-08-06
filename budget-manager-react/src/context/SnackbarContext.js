import React, { createContext, useContext, useState } from 'react';

// 1. Create the context
const SnackbarContext = createContext();

// 2. Create a custom hook for easy access
export const useSnackbar = () => {
    return useContext(SnackbarContext);
};

// 3. Create the Provider component
export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info', // can be 'success', 'error', 'warning', 'info'
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const hideSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // The value provided to consuming components
    const value = {
        showSnackbar,
        hideSnackbar,
        snackbar,
    };

    return (
        <SnackbarContext.Provider value={value}>
            {children}
        </SnackbarContext.Provider>
    );
};