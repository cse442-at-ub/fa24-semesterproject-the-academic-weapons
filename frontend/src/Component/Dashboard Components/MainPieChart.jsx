// MainPieChart.jsx
import React, { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
    ResponsiveContainer
} from 'recharts';

import '../../CSS Files/Dashboard Components/MainPieChart.css';
import SubPieChart from './SubPieChart.jsx';
import GraphSelectionModal from "./GraphSelectionModal.jsx";

const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#E7E9ED",
    "#FFCD56", "#4D5360", "#A3E4D7", "#F1948A", "#C39BD3", "#7FB3D5", "#73C6B6",
    "#F7DC6F", "#F0B27A", "#A569BD", "#5DADE2", "#48C9B0", "#F4D03F", "#F5B041",
    "#EB984E", "#AAB7B8", "#85C1E9", "#F5CBA7", "#52BE80", "#AF7AC5", "#D98880",
    "#D2B4DE", "#D7DBDD", "#58D68D", "#FAD7A0", "#D5F5E3", "#D0ECE7", "#A9CCE3",
    "#F8C471", "#F9E79F", "#B03A2E", "#1F618D", "#117A65", "#F39C12", "#CB4335",
    "#2E86C1", "#D4E6F1", "#148F77", "#52BE80", "#A3E4D7", "#E59866", "#C39BD3",
    "#BB8FCE", "#5D6D7E"
];

const MainPieChart = ({ transactions, openModal }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [data, setData] = useState([]);
    const [subData, setSubData] = useState({});
    const [highest, setHighest] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState('pie');

    // Effect to aggregate transactions by category
    useEffect(() => {
        if (transactions.length > 0 && (!isLoaded || data.length === 0)) {
            totalsByCategory(transactions);
            transactionsByCategory(transactions);
            setIsLoaded(true);
        }
    }, [transactions, isLoaded]); // Removed 'data' from dependencies to prevent immediate re-run

    // Effect to calculate the highest category whenever 'data' changes
    useEffect(() => {
        if (data.length > 0) {
            const highestCat = getHighestCategory(data);
            console.log('Highest Category:', highestCat); // Debugging
            if (highestCat) setHighest(highestCat.name);
        } else {
            setHighest('');
        }
    }, [data]);

    // Function to find the category with the highest value
    function getHighestCategory(totals) {
        return totals.reduce((highest, category) => {
            return (category.value > highest.value) ? category : highest;
        }, totals[0]); // Start with the first category as the highest
    }

    // Function to aggregate transactions by category
    const totalsByCategory = (inputTransactions) => {
        let categorized = inputTransactions.reduce((acc, transaction) => {
            const { category, price } = transaction;

            // Find existing category in the accumulator
            let categoryObj = acc.find(obj => obj.name === category);

            // If category does not exist, create it
            if (!categoryObj) {
                categoryObj = { name: category, value: 0 };
                acc.push(categoryObj);
            }

            // Add the price to the existing category value
            categoryObj.value += parseFloat(price);

            return acc;
        }, []);
        setData(categorized);
        console.log('Aggregated Data:', categorized); // Debugging
    }

    // Function to categorize transactions for sub-charts
    const transactionsByCategory = (inputTransactions) => {
        let categorized = inputTransactions.reduce((acc, transaction) => {
            const { category, ...rest } = transaction;

            // Rename 'price' to 'value'
            const renamedTransaction = { ...rest, value: parseFloat(transaction.price) };
            delete renamedTransaction.price; // Remove 'price'

            // Initialize the category array if it doesn't exist
            if (!acc[category]) {
                acc[category] = [];
            }

            // Push the renamed transaction into the appropriate category
            acc[category].push(renamedTransaction);

            return acc;
        }, {});
        setSubData(categorized);
    }

    // Handler for clicking on a category slice
    const handleClick = (data) => {
        setSelectedCategory(data.name); // Set the clicked category name
    };

    // Handler for selecting chart type from modal
    const handleChartTypeSelect = (type) => {
        setSelectedGraph(type);
        setIsModalOpen(false);
    };

    return (
        <div className="chart-container">
            <h2 className="category-spend-text">Categorized Spending</h2>
            <button onClick={() => setIsModalOpen(true)} className="chart-type-button">Select Chart Type</button>
            <GraphSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleChartTypeSelect}
            />
            {transactions.length > 0 ? (
                <div className="chart-wrapper">
                    {!selectedCategory ? (
                        <div className="chart-content">
                            <ResponsiveContainer width="100%" aspect={1}>
                                {selectedGraph === 'pie' && (
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius="80%"
                                            fill="#ffffff"
                                            dataKey="value"
                                            onClick={handleClick}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                        <Tooltip />
                                    </PieChart>
                                )}
                                {selectedGraph === 'bar' && (
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                )}
                                {selectedGraph === 'line' && (
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                            {highest && (
                                <div className="highest-category-container">
                                    <h3 className="highest-category-text">{"Highest Category: " + highest}</h3>
                                </div>
                            )}
                        </div>
                    ) : (
                        <SubPieChart
                            subData={subData}
                            category={selectedCategory}
                            onBack={() => setSelectedCategory(null)}
                        />
                    )}
                </div>
            ) : (
                <p className="no-data-text">
                    No transactions data to display yet.
                    <br />
                    Try <span onClick={openModal} className="add-transaction-link">adding a transaction</span>
                </p>
            )}
        </div>
    );

};

export default MainPieChart;
