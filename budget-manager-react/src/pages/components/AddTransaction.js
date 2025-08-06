import React, { useState, useEffect } from 'react';
import { getCategories, createTransaction } from '../../services/apiService';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Alert
} from '@mui/material';

const AddTransaction = ({ onTransactionAdded }) => {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    // Get today's date in YYYY-MM-DD format, which is what the input[type=date] requires.
    const today = new Date().toISOString().split('T')[0];

    const [transactionDate, setTransactionDate] = useState(today);
    const [error, setError] = useState('');

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        // Reset form to default state when closing
        setOpen(false);
        setError('');
        setCategoryId('');
        setAmount('');
        setDescription('');
        setTransactionDate(today);
    };

    // Fetch categories when the modal is opened
    useEffect(() => {
        if (open) {
            getCategories()
                .then(response => {
                    setCategories(response.data);
                })
                .catch(err => {
                    setError('Could not load categories.');
                });
        }
    }, [open]);

    const handleSubmit = async () => {
        setError('');
        try {
            // Basic frontend validation for required fields
            if (!categoryId || !amount || !transactionDate) {
                setError("Please fill in all required fields: Amount, Category, and Date.");
                return;
            }

            const transactionData = {
                categoryId: parseInt(categoryId, 10),
                amount: parseFloat(amount),
                description,
                transactionDate,
            };

            await createTransaction(transactionData);
            onTransactionAdded(); // Refresh the dashboard
            handleClose(); // Close the modal on success

        } catch (err) {
            // Smart error handling to display backend validation messages
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                const messages = Object.values(errorData).join(' ');
                setError(messages); // e.g., "Transaction date cannot be in the future."
            } else {
                // Generic error for network issues etc.
                setError('Failed to create transaction. An unexpected error occurred.');
            }
            console.error("Create transaction error:", err);
        }
    };

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>Add Transaction</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add a New Transaction</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        required
                        variant="outlined"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryId}
                            label="Category"
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.type})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Transaction Date"
                        type="date"
                        fullWidth
                        required
                        variant="outlined"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        // The 'inputProps' prop allows us to pass attributes directly to the HTML input element.
                        // The 'max' attribute on an input[type=date] prevents users from selecting a future date.
                        inputProps={{
                            max: today,
                        }}
                        // This ensures the label doesn't overlap with the date value
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddTransaction;