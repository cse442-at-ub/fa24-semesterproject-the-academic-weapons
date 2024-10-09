import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import '../../CSS Files/Dashboard Components/IncomeChart.css'; // Ensure this CSS file exists for styling

const IncomeChart = ({ triggerFetch }) => {
  const [expenses, setExpenses] = useState(0); // Dynamic expenses value
  const income = 100; // Static income value
  const navigate = useNavigate();

  // Replace with actual user ID and token
  const userID = sessionStorage.getItem('User');
  const userToken = sessionStorage.getItem('auth_token');

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/transactions.php?id=${userID}&token=${userToken}`);
      const data = await response.json();

      if (data.success) {
        const totalExpenses = data.transactions.reduce((total, transaction) => total + parseFloat(transaction.price), 0);
        setExpenses(totalExpenses); // Set the total expenses from transactions
      } else {
        console.error("Error fetching expenses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    // Fetch expenses initially when the component mounts
    fetchExpenses();
  }, [userID, userToken]);

  // Trigger fetch when a new transaction is added
  useEffect(() => {
    if (triggerFetch) {
      fetchExpenses();
    }
  }, [triggerFetch]);

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
        Go to Income
      </button>
    </div>
  );
};

export default IncomeChart;
