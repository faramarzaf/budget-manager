import React, { useCallback, useEffect, useState } from 'react';
import { getDashboardSummary, getTransactions } from '../services/apiService';
import { Alert, Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import SpendingChart from './components/SpendingChart';

const DashboardPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            const [summaryRes, transactionsRes] = await Promise.all([
                getDashboardSummary(year, month),
                getTransactions(year, month)
            ]);

            setDashboardData(summaryRes.data);
            setTransactions(transactionsRes.data);

        } catch (err) {
            setError('Failed to fetch dashboard data. Please try again.');
            console.error("Dashboard fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 4 }}>
                <Typography variant="h4">Monthly Dashboard</Typography>
                <AddTransaction onTransactionAdded={refreshData} />
            </Box>

            {/* THE FIX: All components that depend on dashboardData now live inside this block. */}
            {dashboardData && (
                <>
                    {/* Grid for the summary cards */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ backgroundColor: '#e8f5e9' }}>
                                <CardContent>
                                    <Typography color="text.secondary">Total Income</Typography>
                                    <Typography variant="h5" sx={{ color: 'green' }}>${dashboardData.totalIncome.toFixed(2)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ backgroundColor: '#ffebee' }}>
                                <CardContent>
                                    <Typography color="text.secondary">Total Expenses</Typography>
                                    <Typography variant="h5" sx={{ color: 'red' }}>${dashboardData.totalExpense.toFixed(2)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary">Net Balance</Typography>
                                    <Typography variant="h5">${dashboardData.netBalance.toFixed(2)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Grid for the list and the chart */}
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={7}>
                            <TransactionList transactions={transactions} onDataChange={refreshData} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <SpendingChart data={dashboardData.spendingByCategory} />
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default DashboardPage;