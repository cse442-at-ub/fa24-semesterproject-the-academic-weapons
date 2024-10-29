import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../../CSS Files/Dashboard Components/BarChartComponent.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BarChartComponent = ({openTransactionModal, transactions }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [availableYears, setAvailableYears] = useState([]);
  const [barData, setBarData] = useState([]);

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

  // Formatter for the tooltip to display properly formatted value with dollar sign and commas
  const tooltipFormatter = (value) => {
    return `$${parseFloat(value).toLocaleString()}`;
  };

  return (
      <div className="bar-chart-component">
        <div className="bar-chart-header">
          <h3>Monthly Spending - {selectedYear}</h3>

          {availableYears.length > 0 ? (
              <select value={selectedYear} onChange={handleYearChange} className="year-dropdown">
                {availableYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                ))}
              </select>
          ) : (
              <p>No data available for any year</p>
          )}
        </div>

        <div className="bar-chart-wrapper">
          {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={barData}
                    margin={{
                      top: 20, right: 30, left: 20, bottom: 30,
                    }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatYAxis} /> {/* Y-axis now correctly formatted */}
                  <Tooltip formatter={tooltipFormatter} /> {/* Tooltip formatted with dollar sign and commas */}
                  {/*<Legend width={80} />*/}
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
          ) : (
              <p className={"no_content_text"}>No transactions to display for the selected year.<br/>Try <span onClick={openTransactionModal} style={{
                color: "#7984D2",
                textDecoration: "underline",
                cursor: "pointer"
              }}>adding a transaction</span></p>
          )}
        </div>
      </div>
  );
};

export default BarChartComponent;
