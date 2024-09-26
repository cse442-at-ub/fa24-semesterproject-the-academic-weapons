import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import '../../CSS Files/Dashboard Components/BarChartComponent.css';

const barData = [
  { name: 'Food', value: 1.4 },
  { name: 'Clothes', value: 2.4 },
  { name: 'Subscriptions', value: 95.2 },
  { name: 'Gas', value: 1 },
];

const BarChartComponent = () => {
  return (
    <div className="bar-chart-component">
      {/* Add button in top right */}
      <div className="bar-chart-header">
        <h3>Monthly Spending</h3>
        <button className="add-button">Add</button>
      </div>
      
      {/* Center the bar chart */}
      <div className="bar-chart-wrapper">
        <BarChart width={300} height={200} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default BarChartComponent;