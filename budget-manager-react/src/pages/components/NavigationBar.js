import React, { useState } from 'react';
import {AppBar, Badge, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useNotifications} from '../../context/NotificationContext';


// This component displays the main site navigation and the logout button.
const NavigationBar = ({onLogout}) => {
    // Get the notification data and functions from our global context
    const {notifications, unreadCount, markAsRead} = useNotifications();

    // State to manage the pop-up menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (id) => {
        markAsRead(id);
        // You could also add navigation here, e.g., navigate to the budgets page
        handleMenuClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    Budget Manager
                </Typography>

                <Box>
                    <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
                    <Button color="inherit" component={RouterLink} to="/categories">Categories</Button>
                    <Button color="inherit" component={RouterLink} to="/budgets">Budgets</Button>
                </Box>

                {/* Notification Bell Icon */}
                <IconButton color="inherit" onClick={handleMenuOpen}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>

                {/* Notification Dropdown Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                >
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <MenuItem
                                key={n.id}
                                onClick={() => handleNotificationClick(n.id)}
                                // Style unread notifications to be bold
                                sx={{fontWeight: n.isRead ? 'normal' : 'bold', whiteSpace: 'normal'}}
                            >
                                {n.message}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No new notifications</MenuItem>
                    )}
                </Menu>

                <Button color="inherit" onClick={onLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;