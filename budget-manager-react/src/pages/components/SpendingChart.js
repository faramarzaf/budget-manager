import React from 'react';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {Paper, Typography} from '@mui/material';

// These are some pre-defined colors for our chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

const SpendingChart = ({data}) => {
    // Recharts expects the data in a specific format: an array of objects with 'name' and 'value' keys.
    const chartData = data.map(item => ({
        name: item.categoryName,
        value: item.total,
    }));

    if (!chartData || chartData.length === 0) {
        return (
            <Paper sx={{p: 2, textAlign: 'center', mt: 4}}>
                <Typography>No expense data available to display chart.</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{p: 2, mt: 4}}>
            <Typography variant="h6" gutterBottom>Spending by Category</Typography>
            {/* ResponsiveContainer makes the chart adapt to the size of its parent container */}
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {/* Map over the data to assign a unique color to each slice of the pie */}
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`}/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default SpendingChart;