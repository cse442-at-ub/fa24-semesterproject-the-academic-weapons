import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import '../../CSS Files/Dashboard Components/IncomeChart.css'; // Ensure to create this CSS file for styling

const IncomeChart = () => {
  const income = 500; // Static income value
  const expenses = 50; // Static expenses value
  const navigate = useNavigate();

  const data = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div className="income-widget">
      <h2>Income Summary</h2>
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <p>Total Income: ${income}</p>
      <p>Total Expenses: ${expenses}</p>
      <button className="income-button" onClick={() => navigate('/income')}>
        Got to Income
      </button>
    </div>
  );
};

export default IncomeChart;
