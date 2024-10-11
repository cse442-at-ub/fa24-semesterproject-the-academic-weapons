import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import '../../CSS Files/Dashboard Components/IncomeChart.css'; // Ensure this CSS file exists for styling

const IncomeChart = ({ triggerFetch }) => {
  const [expenses, setExpenses] = useState(0); // Dynamic expenses value
  const [income, setIncome] = useState(0); // Dynamic income value fetched from backend
  const navigate = useNavigate();

  const userID = sessionStorage.getItem('User');
  const userToken = sessionStorage.getItem('auth_token');

  // Fetch total income from the backend
  const fetchIncome = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}`); // Update to the correct endpoint
      const data = await response.json();

      if (data.success) {
        setIncome(parseFloat(data.totalIncome)); // Set the total income from the database
      } else {
        console.error("Error fetching income:", data.message);
      }
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  };

  // Fetch expenses from the backend
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
    // Fetch income and expenses initially when the component mounts
    fetchIncome();
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
      <p>Total Income: ${income.toFixed(2)}</p>
      <p>Total Expenses: ${expenses.toFixed(2)}</p>
      <button className="income-button" onClick={() => navigate('/income')}>
        Go to Income
      </button>
    </div>
  );
};

export default IncomeChart;
