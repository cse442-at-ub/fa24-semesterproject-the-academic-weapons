// SubPieChart.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import '../../CSS Files/Dashboard Components/SubPieChart.css';

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

const SubPieChart = ({ category, onBack, subData }) => {
    const [data, setData] = useState([]);
    const [highest, setHighest] = useState('');

    useEffect(() => {
        if (subData[category]) {
            setData(subData[category]);

            const highestCat = getHighestTransactionInCategory(category, subData);
            if (highestCat) {
                setHighest(highestCat.name);
            } else {
                setHighest('N/A');
            }
        }
    }, [subData, category]);

    const getHighestTransactionInCategory = (category, transactionsByCategory) => {
        const transactions = transactionsByCategory[category];

        if (!transactions || transactions.length === 0) {
            return null; // Return null if category doesn't exist or is empty
        }

        return transactions.reduce((highest, transaction) => {
            return (transaction.value > highest.value) ? transaction : highest;
        }, transactions[0]); // Start with the first transaction as the highest
    };

    return (
        <div className="sub-pie-chart">
            <button onClick={onBack} className="back-button">Back</button>
            <div className="chart-container">
                <ResponsiveContainer width="100%" aspect={1}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius="80%"
                            fill="#ffffff"
                            dataKey="value"
                            onClick={() => {}}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <h3 className="highest-item">Highest Item: {highest}</h3>
        </div>
    );
};

export default SubPieChart;
