import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../CSS Files/Dashboard Components/MainPieChart.css';
import SubPieChart from './SubPieChart.jsx';

const data = [
  { name: 'Food', value: 400 },
  { name: 'Subscriptions', value: 300 },
  { name: 'Other', value: 300 },
];

const colors = ['#8884d8', '#82ca9d', '#8dd1e1'];

const MainPieChart = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
  
    const handleClick = (data) => {
      setSelectedCategory(data.name); // Set the clicked category name
    };
  
    return (
      <div className="chart-container"> {/* Add a fixed container */}
        {!selectedCategory ? (
          <PieChart width={280} height={400}>
            <Pie
              data={data}
              cx={140}
              cy={140}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onClick={(e) => handleClick(e)} // Pass event data
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Legend width={280} />
            <Tooltip />
          </PieChart>
        ) : (
          <SubPieChart
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)} // Back to main chart
          />
        )}
      </div>
      
    );
  };
  
  export default MainPieChart;