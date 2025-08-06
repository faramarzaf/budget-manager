import React, {useCallback, useEffect, useState} from 'react';
import {createCategory, deleteCategory, getCategories} from '../services/apiService';
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    // State for the "Add New Category" form
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryType, setNewCategoryType] = useState('EXPENSE');

    // A stable function to fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to load categories.');
        }
    }, []);

    // Initial fetch when the component loads
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createCategory({name: newCategoryName, type: newCategoryType});
            setNewCategoryName(''); // Clear form
            fetchCategories(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add category. Name might already exist.');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure? Deleting a category will also delete all associated transactions.')) {
            try {
                await deleteCategory(id);
                fetchCategories(); // Refresh the list
            } catch (err) {
                setError('Failed to delete category.');
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{mt: 4, mb: 2}}>Manage Categories</Typography>

            {/* Form for adding a new category */}
            <Paper sx={{p: 2, mb: 4}}>
                <Typography variant="h6">Add New Category</Typography>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                <Box component="form" onSubmit={handleAddCategory} sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                    <TextField
                        label="Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                        sx={{flexGrow: 1}}
                    />
                    <FormControl sx={{minWidth: 120}}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={newCategoryType}
                            onChange={(e) => setNewCategoryType(e.target.value)}
                            label="Type"
                        >
                            <MenuItem value="EXPENSE">Expense</MenuItem>
                            <MenuItem value="INCOME">Income</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained">Add</Button>
                </Box>
            </Paper>

            {/* List of existing categories */}
            <Typography variant="h6">Existing Categories</Typography>
            <List>
                {categories.map((category) => (
                    <ListItem
                        key={category.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete"
                                        onClick={() => handleDeleteCategory(category.id)}>
                                <DeleteIcon/>
                            </IconButton>
                        }
                        sx={{border: '1px solid #ddd', mb: 1, borderRadius: 1}}
                    >
                        <ListItemText
                            primary={category.name}
                            secondary={category.type}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default CategoriesPage;