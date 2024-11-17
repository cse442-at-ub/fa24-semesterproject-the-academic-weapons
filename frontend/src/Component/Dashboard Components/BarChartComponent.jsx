// BarChartComponent.jsx
import React, { useState, useEffect } from 'react';
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
import '../../CSS Files/Dashboard Components/MainPieChart.css'; // Reusing MainPieChart CSS
import GraphSelectionModal from "./GraphSelectionModal.jsx";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const colors = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
  "#E7E9ED", "#FFCD56", "#4D5360", "#A3E4D7", "#F1948A", "#C39BD3"
];

const BarChartComponent = ({ openTransactionModal, transactions }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [availableYears, setAvailableYears] = useState([]);
  const [barData, setBarData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState('bar');
  const [highest, setHighest] = useState('');

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setAvailableYears([]);
      setBarData([]);
      return;
    }

    // Extract unique years from transactions
    const years = Array.from(new Set(transactions.map(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear();
    })));

    // Sort years in descending order (optional)
    years.sort((a, b) => b - a);

    setAvailableYears(years);
    // Do not change `selectedYear` here; only set available years
  }, [transactions]);

  useEffect(() => {
    if (!transactions || transactions.length === 0 || !availableYears.includes(selectedYear)) {
      setBarData([]); // No data for the selected year, set bar data to empty
      setHighest('');
      return;
    }

    // Aggregate transactions by month for the selected year
    const aggregateDataByMonth = () => {
      const monthlyData = Array(12).fill(0).map((_, index) => ({ name: months[index], value: 0 }));

      transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        if (transactionYear === selectedYear) {
          const monthIndex = transactionDate.getMonth();
          monthlyData[monthIndex].value += parseFloat(transaction.price);
        }
      });

      setBarData(monthlyData);

      // Determine the highest spending month
      const highestMonth = monthlyData.reduce((prev, current) => (current.value > prev.value ? current : prev), monthlyData[0]);
      setHighest(highestMonth.name);
    };

    aggregateDataByMonth();
  }, [selectedYear, transactions, availableYears]);

  // Handle year change when the user explicitly selects a different year
  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  // Handler for selecting chart type from modal
  const handleChartTypeSelect = (type) => {
    setSelectedGraph(type);
    setIsModalOpen(false);
  };

  // Formatter to add dollar signs to Y-axis
  const formatYAxis = (tickItem) => {
    return `$${tickItem.toLocaleString()}`;
  };

  // Formatter for the tooltip to display properly formatted value with dollar sign and commas
  const tooltipFormatter = (value) => {
    return `$${parseFloat(value).toLocaleString()}`;
  };

  return (
      <div className="chart-container">
        <h2 className="category-spend-text">Monthly Spending</h2>
        <div className="chart-wrapper">
          <div className="header-controls">
            {availableYears.length > 0 ? (
                <select value={selectedYear} onChange={handleYearChange} className="year-dropdown">
                  {availableYears.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                  ))}
                </select>
            ) : (
                <p className="no-data-text">No data available for any year</p>
            )}
            <button onClick={() => setIsModalOpen(true)} className="chart-type-button">Select Chart Type</button>
          </div>

          <GraphSelectionModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSelect={handleChartTypeSelect}
          />

          {barData.length > 0 ? (
              <div className="chart-content">
                <ResponsiveContainer width="100%" aspect={1}>
                  {selectedGraph === 'pie' && (
                      <PieChart>
                        <Pie
                            data={barData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius="80%"
                            fill="#ffffff"
                            dataKey="value"
                        >
                          {barData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={tooltipFormatter} />
                      </PieChart>
                  )}
                  {selectedGraph === 'bar' && (
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatYAxis} />
                        <Tooltip formatter={tooltipFormatter} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                  )}
                  {selectedGraph === 'line' && (
                      <LineChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatYAxis} />
                        <Tooltip formatter={tooltipFormatter} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      </LineChart>
                  )}
                </ResponsiveContainer>
                {highest && (
                    <div className="highest-category-container">
                      <h3 className="highest-category-text">Highest Spending Month: {highest}</h3>
                    </div>
                )}
              </div>
          ) : (
              <p className="no-data-text">
                No transactions to display for the selected year.<br />
                Try <span onClick={openTransactionModal} className="add-transaction-link">adding a transaction</span>
              </p>
          )}
        </div>
      </div>
  );
};

export default BarChartComponent;
