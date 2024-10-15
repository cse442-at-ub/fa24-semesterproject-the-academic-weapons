import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import '../../CSS Files/Dashboard Components/IncomeChart.css'; // Ensure this CSS file exists for styling

const IncomeChart = ({income, transactions }) => {
  const [expenses, setExpenses] = useState(0); // Dynamic expenses value
  const navigate = useNavigate();
  const [data, setData] = useState([{ name: 'Income', value: income }, { name: 'Expenses', value: 0 }]);
  const [isLoaded, setIsLoaded] = useState(false)
  const userID = sessionStorage.getItem('User');
  const userToken = sessionStorage.getItem('auth_token');

  // Fetch total income from the backend


  useEffect(() => {
    // Fetch income and expenses initially when the component mounts
    if (transactions.length > 0) {
      if (expenses === 0 || !isLoaded) {
        getTotalTransactions(transactions)
        setIsLoaded(true);
      } else if (expenses > 0) {
        setData([{ name: 'Income', value: income }, { name: 'Expenses', value: expenses },])
        setIsLoaded(false);
      }
    }

  }, [userID, userToken, transactions, expenses, income]);

  const getTotalTransactions = (inputTransactions) => {
    let total = inputTransactions.reduce((total, transaction) => total + parseFloat(transaction.price), 0);
    setExpenses(total)
  }

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
