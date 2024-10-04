import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import '../../CSS Files/Dashboard Components/BarChartComponent.css';

const barData = [
  { name: 'Sep', value: 45 },
  { name: 'Oct', value: 2.4 },
  { name: 'Nov', value: 95.2 },
  { name: 'Dec', value: 3 },
  { name: 'Jan', value: 42 },
  { name: 'Feb', value: 11 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 65 },
];

const BarChartComponent = () => {
  return (
    <div className="bar-chart-component">
      {/* Add button in top right */}
      <div className="bar-chart-header">
        <h3>Monthly Spending</h3>
        
      </div>
      
      {/* Center the bar chart */}
      <div className="bar-chart-wrapper">
        {/* Graph width needs to be able to adjust like 
          max-width: 650px;
          min-width: 400px;
          max-height: 400px;
          min-height: 200px;
          So move it dynamically especially with mobile
        */}
        <BarChart width={600} height={400} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
            <Legend width={80} />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default BarChartComponent;