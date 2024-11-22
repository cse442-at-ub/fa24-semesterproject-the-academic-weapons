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
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#E7E9ED", "#FFCD56",
    "#4D5360", "#A3E4D7", "#F1948A", "#C39BD3",
    "#7FB3D5", "#73C6B6", "#F7DC6F", "#F0B27A",
    "#A569BD", "#5DADE2", "#48C9B0", "#F4D03F",
    "#F5B041", "#EB984E", "#AAB7B8", "#85C1E9",
    "#F5CBA7", "#52BE80", "#AF7AC5", "#D98880",
    "#D2B4DE", "#D7DBDD", "#58D68D", "#FAD7A0",
    "#D5F5E3", "#D0ECE7", "#A9CCE3", "#F8C471",
    "#F9E79F", "#B03A2E", "#1F618D", "#117A65",
    "#F39C12", "#CB4335", "#2E86C1", "#D4E6F1",
    "#148F77", "#52BE80", "#A3E4D7", "#E59866",
    "#C39BD3", "#BB8FCE", "#5D6D7E"
];

const MainPieChart = ({ transactions, openModal }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [data, setData] = useState([]);
    const [subData, setSubData] = useState({});
    const [highest, setHighest] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState('pie');

    useEffect(() => {
        if (transactions.length > 0 && !isLoaded) {
            totalsByCategory(transactions);
            transactionsByCategory(transactions);
            setIsLoaded(true);
        }
    }, [transactions, isLoaded]);

    const getHighestCategory = (totals) => {
        return totals.reduce((highest, category) => {
            return (category.value > highest.value) ? category : highest;
        }, totals[0]);
    };

    const totalsByCategory = (inputTransactions) => {
        const categorized = inputTransactions.reduce((acc, transaction) => {
            const { category, price } = transaction;
            let categoryObj = acc.find(obj => obj.name === category);

            if (!categoryObj) {
                categoryObj = { name: category, value: 0 };
                acc.push(categoryObj);
            }

            categoryObj.value += parseFloat(price);
            return acc;
        }, []);

        setData(categorized);

        if (categorized.length > 0) {
            const highestCat = getHighestCategory(categorized);
            setHighest(highestCat.name);
        }
    };

    const transactionsByCategory = (inputTransactions) => {
        const categorized = inputTransactions.reduce((acc, transaction) => {
            const { category, ...rest } = transaction;
            const renamedTransaction = { ...rest, value: parseFloat(transaction.price) };
            delete renamedTransaction.price;

            if (!acc[category]) {
                acc[category] = [];
            }

            acc[category].push(renamedTransaction);
            return acc;
        }, {});
        setSubData(categorized);
    };

    const handleClick = (data) => {
        if (data && data.name) {
            setSelectedCategory(data.name);
        }
    };

    const handleChartTypeSelect = (type) => {
        setSelectedGraph(type);
        setIsModalOpen(false);
    };

    return (
        <div className="main-pie-chart">
            <h2 className="Category_spend_txt">Categorized Spending</h2>
            {transactions.length > 0 && (
                <button onClick={() => setIsModalOpen(true)} className="chart-type-button">
                    Select Chart Type
                </button>
            )}
            <GraphSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleChartTypeSelect}
            />
            {transactions.length > 0 ? (
                <>
                    {!selectedCategory ? (
                        <div className="chart-section">
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
                                        <Legend verticalAlign="bottom" height={36}/>
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
                            <h3 className="highest-category">Highest Category: {highest}</h3>
                        </div>
                    ) : (
                        <SubPieChart
                            subData={subData}
                            category={selectedCategory}
                            onBack={() => setSelectedCategory(null)}
                        />
                    )}
                </>
            ) : (
                <p className="no_content_text" style={{ textAlign: "center" }}>
                    No transactions data to display yet.
                    <br />
                    Try <span onClick={openModal} style={{ color: "#7984D2", textDecoration: "underline", cursor: "pointer" }}>adding a transaction</span>
                </p>
            )}
        </div>
    );
};

export default MainPieChart;
