import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../CSS Files/Dashboard Components/SubPieChart.css';

const subDataMap = {
  'Category 1': [
    { name: 'Sub-Category 1', value: 150 },
    { name: 'Sub-Category 2', value: 250 },
  ],
  'Category 2': [
    { name: 'Sub-Category 1', value: 100 },
    { name: 'Sub-Category 2', value: 200 },
  ],
  Other: [
    { name: 'Sub-Category 1', value: 100 },
    { name: 'Sub-Category 2', value: 200 },
  ],
};

const colors = ['#8884d8', '#82ca9d'];

const SubPieChart = ({ category, onBack }) => {
    const subData = subDataMap[category];
  
    return (
      <div className="sub-pie-container">
        <button onClick={onBack}>Back</button>
        <PieChart width={400} height={400}> {/* Same size as main chart */}
          <Pie
            data={subData}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {subData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </div>
    );
  };
  
  export default SubPieChart;