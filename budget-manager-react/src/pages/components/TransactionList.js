import React from 'react';
import { deleteTransaction } from '../../services/apiService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from '../../context/SnackbarContext';

const TransactionList = ({ transactions, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id);
                showSnackbar('Transaction deleted successfully!', 'success');
                onDataChange();
            } catch (err) {
                showSnackbar('Failed to delete transaction.', 'error');
                console.error("Delete error:", err);
            }
        }
    };

    // If the transactions array is empty, show a message on a Paper background.
    if (!transactions || transactions.length === 0) {
        return (
            // THE FIX IS HERE: 'component' is now a direct prop of Box, not inside 'sx'.
            // I've also added some padding (p: 2) to make it look nicer.
            <Box component={Paper} sx={{ mt: 4, p: 2, textAlign: 'center' }}>
                <Typography>No transactions recorded for this month.</Typography>
            </Box>
        );
    }

    // If there are transactions, render the table.
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Recent Transactions
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow
                                key={transaction.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{transaction.transactionDate}</TableCell>
                                <TableCell>{transaction.categoryName}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ color: transaction.categoryType === 'INCOME' ? 'green' : 'red', fontWeight: 'bold' }}
                                >
                                    {transaction.categoryType === 'INCOME' ? '+' : '-'}
                                    ${transaction.amount.toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleDelete(transaction.id)} color="error" size="small" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TransactionList;