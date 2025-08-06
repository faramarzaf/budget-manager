import React, {useState} from 'react';
import {registerUser} from '../services/apiService'; // Import our specific API function
import {Alert, Box, Button, Container, TextField, Typography} from '@mui/material'; // Using MUI components
import {Link} from 'react-router-dom'; // Assuming you'll add navigation later

const RegisterPage = () => {
    // 'useState' is a React Hook that gives a component its own "state" (memory).
    // We create state variables to hold the user's input in the form fields.
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State variables to hold feedback for the user (errors or success messages)
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // This function is called when the user clicks the "Sign Up" button.
    // It's 'async' because we need to wait for the API call to finish.
    const handleSubmit = async (event) => {
        event.preventDefault(); // This stops the browser from doing a full-page reload on submit.
        setError(null);         // Clear any previous errors before a new attempt.
        setSuccess(null);

        // Basic frontend validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            // Bundle the form data into an object matching our backend's DTO.
            const userData = {fullName, email, password};

            // Call our API service function and wait for the response.
            await registerUser(userData);

            // If the call succeeds, set a success message.
            setSuccess('Registration successful! You can now proceed to login.');

        } catch (err) {
            // This block runs if the API call throws an error.
            if (err.response && err.response.data) {
                // If the error has a response from our backend (e.g., 400 or 409 status)
                // we can display the specific message from our Java GlobalExceptionHandler.
                const errorData = err.response.data;
                const messages = Object.values(errorData).join(', '); // e.g., "User with this email already exists."
                setError(messages);
            } else {
                // For generic network errors (e.g., backend is down).
                setError('Registration failed. Please try again later.');
            }
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography component="h1" variant="h5">
                    Create Your Account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}} noValidate>
                    {/* Display feedback messages using MUI's Alert component */}
                    {success && <Alert severity="success">{success}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="fullName"
                        label="Full Name"
                        name="fullName"
                        autoComplete="name"
                        autoFocus
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                        Sign Up
                    </Button>
                    <Typography align="center">
                        <Link to="/login">
                            Already have an account? Sign In
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;