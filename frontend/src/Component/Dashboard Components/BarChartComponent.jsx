import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import '../../CSS Files/Dashboard Components/BarChartComponent.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BarChartComponent = ({ transactions }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      // If no transactions, clear available years and bar data
      setAvailableYears([]);
      setBarData([]);
      return;
    }

    // Extract available years from transactions
    const years = Array.from(new Set(transactions.map(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear();
    })));

    // Sort years in descending order (optional)
    years.sort((a, b) => b - a);

    // Set the available years and default to the most recent year
    setAvailableYears(years);
    if (years.length > 0) {
      setSelectedYear(years[0]); // Default to the most recent year with data
    }
  }, [transactions]);

  useEffect(() => {
    if (!transactions || transactions.length === 0 || !availableYears.includes(selectedYear)) {
      setBarData([]); // No data for the selected year, set bar data to empty
      return;
    }

    const aggregateDataByMonth = () => {
      // Initialize data array for 12 months
      const monthlyData = Array(12).fill(0).map((_, index) => ({ name: months[index], value: 0 }));

      // Filter transactions by selected year and calculate monthly totals
      transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        if (transactionYear === selectedYear) {
          const monthIndex = transactionDate.getMonth(); // Get the month (0 for Jan, 11 for Dec)
          monthlyData[monthIndex].value += parseFloat(transaction.price); // Convert price to number
        }
      });

      setBarData(monthlyData);
    };

    aggregateDataByMonth();
  }, [selectedYear, transactions, availableYears]);

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
      <div className="bar-chart-component">
        <div className="bar-chart-header">
          <h3>Monthly Spending - {selectedYear}</h3>

          {availableYears.length > 0 ? (
              <select value={selectedYear} onChange={handleYearChange}>
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
              <BarChart
                  width={600}
                  height={400}
                  data={barData}
                  style={{ maxWidth: '650px', minWidth: '400px', maxHeight: '400px', minHeight: '200px' }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend width={80} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
          ) : (
              <p>No transactions to display for the selected year.</p>
          )}
        </div>
      </div>
  );
};

export default BarChartComponent;
