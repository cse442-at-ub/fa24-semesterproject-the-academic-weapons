import React, { useState, useEffect, useRef } from 'react';
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
  const [chartSize, setChartSize] = useState({ width: 450, height: 400 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Function to update chart dimensions based on container size
    const updateChartSize = () => {
      if (containerRef.current) {
        const { offsetWidth } = containerRef.current;
        const newSize = Math.min(Math.max(offsetWidth, 220), 450); // Bound width between 220 and 450
        const newHeight = Math.min(Math.max((newSize / 1.5), 300), 450); // Adjust height proportionally within min/max bounds
        setChartSize({ width: newSize, height: newHeight });
      }
    };

    updateChartSize(); // Initial size setting
    window.addEventListener('resize', updateChartSize); // Handle window resize

    return () => {
      window.removeEventListener('resize', updateChartSize);
    };
  }, []);

  return (
    <div className="bar-chart-component" ref={containerRef}>
      {/* Header */}
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
          <BarChart width={chartSize.width} height={chartSize.height} data={barData}>
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