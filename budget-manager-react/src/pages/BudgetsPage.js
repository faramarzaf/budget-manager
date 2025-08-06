import React, {useCallback, useEffect, useState} from 'react';
import {getBudgets, getCategories, getDashboardSummary, setBudget} from '../services/apiService';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    InputAdornment,
    LinearProgress,
    Paper,
    TextField,
    Typography
} from '@mui/material';

const BudgetsPage = () => {
    // State for the final, merged data to be displayed
    const [budgetData, setBudgetData] = useState([]);
    // State to manage the values in the input fields
    const [inputValues, setInputValues] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            // 1. Fetch all three data sources in parallel for efficiency
            const [categoriesRes, budgetsRes, summaryRes] = await Promise.all([
                getCategories(),
                getBudgets(year, month),
                getDashboardSummary(year, month)
            ]);

            // 2. Process the data for easy lookups
            const budgetsMap = new Map(budgetsRes.data.map(b => [b.categoryId, b.amount]));
            const spendingMap = new Map(summaryRes.data.spendingByCategory.map(s => [s.categoryName, s.total]));

            // 3. Merge the data: We only want to show budgets for EXPENSE categories
            const mergedData = categoriesRes.data
                .filter(cat => cat.type === 'EXPENSE')
                .map(cat => ({
                    categoryId: cat.id,
                    categoryName: cat.name,
                    budgeted: budgetsMap.get(cat.id) || 0,
                    spent: spendingMap.get(cat.name) || 0,
                }));

            setBudgetData(mergedData);

            // Initialize the input fields with the current budget values
            const initialInputs = {};
            mergedData.forEach(data => {
                initialInputs[data.categoryId] = data.budgeted > 0 ? data.budgeted.toFixed(2) : '';
            });
            setInputValues(initialInputs);

        } catch (err) {
            setError('Failed to load budget data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (categoryId, value) => {
        setInputValues(prev => ({...prev, [categoryId]: value}));
    };

    const handleSetBudget = async (categoryId) => {
        const amount = parseFloat(inputValues[categoryId]);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid, positive number for the budget.');
            return;
        }

        try {
            const now = new Date();
            await setBudget({
                categoryId,
                amount,
                year: now.getFullYear(),
                month: now.getMonth() + 1
            });
            // Refresh all data to show the update
            fetchData();
        } catch (err) {
            alert('Failed to set budget.');
        }
    };

    if (isLoading) return <CircularProgress sx={{display: 'block', margin: 'auto', mt: 4}}/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container>
            <Typography variant="h4" sx={{mt: 4, mb: 4}}>Manage Budgets</Typography>
            {budgetData.map(item => {
                const progress = item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
                return (
                    <Paper key={item.categoryId} sx={{p: 2, mb: 2}}>
                        <Typography variant="h6">{item.categoryName}</Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', mt: 1}}>
                            <Box sx={{width: '100%', mr: 1}}>
                                <LinearProgress variant="determinate" value={Math.min(progress, 100)}
                                                color={progress > 100 ? 'error' : 'primary'}/>
                            </Box>
                            <Box sx={{minWidth: 100}}>
                                <Typography variant="body2" color="text.secondary">
                                    ${item.spent.toFixed(2)} / ${item.budgeted.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', gap: 2, mt: 2}}>
                            <TextField
                                label="Set Budget"
                                type="number"
                                size="small"
                                value={inputValues[item.categoryId] || ''}
                                onChange={(e) => handleInputChange(item.categoryId, e.target.value)}
                                InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}
                            />
                            <Button variant="contained" onClick={() => handleSetBudget(item.categoryId)}>
                                Save
                            </Button>
                        </Box>
                    </Paper>
                );
            })}
        </Container>
    );
};

export default BudgetsPage;