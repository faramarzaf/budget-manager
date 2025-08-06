import React from 'react';
import {Alert, Snackbar} from '@mui/material';
import {useSnackbar} from '../../context/SnackbarContext';

const GlobalSnackbar = () => {
    // Get the state and functions from our context
    const {snackbar, hideSnackbar} = useSnackbar();

    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000} // Hide after 6 seconds
            onClose={hideSnackbar}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        >
            {/* The Alert component gives us the nice colored background */}
            <Alert onClose={hideSnackbar} severity={snackbar.severity} sx={{width: '100%'}}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalSnackbar;