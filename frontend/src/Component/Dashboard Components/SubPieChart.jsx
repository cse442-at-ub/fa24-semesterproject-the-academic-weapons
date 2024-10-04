import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../CSS Files/Dashboard Components/SubPieChart.css';

const subDataMap = {
  'Food': [
    { name: 'Hotdog', value: 150 },
    { name: 'Banana', value: 250 },
  ],
  'Subscriptions': [
    { name: 'Netflix', value: 100 },
    { name: 'Hulu', value: 200 },
  ],
  Other: [
    { name: 'Wax', value: 100 },
    { name: 'Gloves', value: 200 },
  ],
};

const colors = ['#8884d8', '#82ca9d'];

const SubPieChart = ({ category, onBack }) => {
    const subData = subDataMap[category];
  
    return (
      <div className="sub-pie-container">
        <button onClick={onBack}>Back</button>
        <PieChart width={280} height={400}> {/* Same size as main chart */}
          <Pie
            data={subData}
            cx={140}
            cy={140}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {subData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Legend width={280} />
          <Tooltip />
        </PieChart>
      </div>
    );
  };
  
  export default SubPieChart;