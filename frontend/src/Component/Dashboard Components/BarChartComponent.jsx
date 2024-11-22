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
import '../../CSS Files/Dashboard Components/BarChartComponent.css';
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
  const [selectedChart, setSelectedChart] = useState('bar');

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
    };

    aggregateDataByMonth();
  }, [selectedYear, transactions, availableYears]); // Only recalculate bar data when selectedYear changes or transactions are updated

  // Handle year change when the user explicitly selects a different year
  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  // Formatter to add dollar signs to Y-axis
  const formatYAxis = (tickItem) => {
    return `$${tickItem.toLocaleString()}`;
  };

  const handleChartTypeSelect = (type) => {
    setSelectedChart(type);
    setIsModalOpen(false);
  };

  // Formatter for the tooltip to display properly formatted value with dollar sign and commas
  const tooltipFormatter = (value) => {
    return `$${parseFloat(value).toLocaleString()}`;
  };

  return (
    <div className="bar-chart-component">
      <div className="bar-chart-header">
        <h2 className="Category_spend_txt">Monthly Spending</h2>
        <div className="header-controls">
          {availableYears.length > 0 && (
            <>
              <select value={selectedYear} onChange={handleYearChange} className="year-dropdown">
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button onClick={() => setIsModalOpen(true)} className="chart-type-button">Select Chart Type</button>
            </>
          )}
        </div>
      </div>

      <GraphSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleChartTypeSelect}
      />

      <div className="bar-chart-wrapper">
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" aspect={1}>
            {selectedChart === 'bar' && (
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={60} />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip formatter={tooltipFormatter} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            )}
            {selectedChart === 'line' && (
              <LineChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={60} />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip formatter={tooltipFormatter} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            )}
            {selectedChart === 'pie' && (
              <PieChart>
                <Pie
                  data={barData}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            )}
          </ResponsiveContainer>
        ) : (
          <p className="no_content_text">
            No transactions to display.<br />
            Try <span onClick={openTransactionModal} style={{ color: "#7984D2", textDecoration: "underline", cursor: "pointer" }}>adding a transaction</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default BarChartComponent;
