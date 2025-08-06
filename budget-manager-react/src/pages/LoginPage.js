import React, { useState } from 'react';
// THE FIX IS HERE: We must import 'loginUser', not 'registerUser'.
import { loginUser } from '../services/apiService';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const credentials = { email, password };

            // THE FIX IS HERE: We call the correct 'loginUser' function.
            const response = await loginUser(credentials);

            const token = response.data.jwtToken;
            localStorage.setItem('jwtToken', token);
            onLoginSuccess();

        } catch (err) {
            setError('Login failed. Please check your email and password.');
            // This console.error is very helpful for debugging, just like you did!
            console.error("Login error:", err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    <Typography align="center">
                        <Link to="/register">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;