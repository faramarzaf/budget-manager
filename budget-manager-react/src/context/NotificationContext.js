import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/apiService';

// 1. Create the context
const NotificationContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useNotifications = () => {
    return useContext(NotificationContext);
};

// 3. Create the Provider component
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // A stable function to fetch notifications from the API
    const fetchNotifications = useCallback(async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect for initial fetch AND periodic polling
    useEffect(() => {
        // Fetch immediately when the component mounts
        fetchNotifications();

        // Set up polling to fetch notifications every 30 seconds
        const intervalId = setInterval(fetchNotifications, 30000);

        // Cleanup function: This is crucial to prevent memory leaks.
        // It runs when the component unmounts.
        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    // Function to mark a notification as read
    const markAsRead = async (id) => {
        try {
            // Optimistic UI Update: Immediately update the state for a snappy user experience
            setNotifications(prevNotifications =>
                prevNotifications.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            // Then, make the API call in the background
            await markNotificationAsRead(id);
        } catch (error) {
            console.error('Failed to mark notification as read', error);
            // If the API call fails, we could optionally revert the state
        }
    };

    // The value that will be provided to all consuming components
    const value = {
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length,
        isLoading,
        markAsRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};