import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import '../CSS Files/Income.css'; // Ensure to create this CSS file for styling

const Income = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [totalIncome, setTotalIncome] = useState(100); // Initial total income set to 100
  const [monthlyIncomeValue, setMonthlyIncomeValue] = useState(0); // Initial monthly income
  const [expenses, setExpenses] = useState(0); // Dynamic expenses value

  const userID = sessionStorage.getItem('User');
  const userToken = sessionStorage.getItem('auth_token');

  // Fetch user transactions (expenses) from the backend
  useEffect(() => {
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

    fetchExpenses();
  }, [userID, userToken]);

  // Data for Total Income chart (total income minus expenses)
  const totalIncomeData = [
    { name: 'Net Income', value: totalIncome - expenses }, // Net income after expenses
    { name: 'Expenses', value: expenses }, // Fetched expenses
  ];

  // Data for Monthly Income chart
  const monthlyIncomeData = [
    { name: 'Monthly Income', value: monthlyIncomeValue }, // Chart for monthly income
    { name: 'Remaining', value: expenses }, // Remaining from total income (or some other value based on your logic)
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  // Handle monthly income input change
  const handleMonthlyIncomeChange = (e) => {
    setMonthlyIncome(e.target.value);
  };

  // Handle monthly income submission
  const handleMonthlyIncomeSubmit = () => {
    const incomeValue = parseFloat(monthlyIncome);
    if (!isNaN(incomeValue) && incomeValue > 0) {
      setMonthlyIncomeValue(incomeValue); // Update monthly income value
      setTotalIncome(prevTotalIncome => prevTotalIncome + incomeValue); // Add monthly income to total income
      alert(`Monthly Income Submitted: $${incomeValue}`);
      setMonthlyIncome(''); // Reset input field
    } else {
      alert('Please enter a valid income amount.');
    }
  };

  return (
    <div className="income-page">
      <h1>Income Details</h1>
      <h3>Total Income: ${totalIncome}</h3>
      <h3>Total Expenses: ${expenses}</h3>

      <div className="charts-container">
        {/* Total Income Chart */}
        <div className="pie-chart-container">
          <h3>Total Income (Net After Expenses)</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={totalIncomeData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {totalIncomeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Monthly Income Chart */}
        <div className="pie-chart-container">
          <h3>Monthly Income</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={monthlyIncomeData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {monthlyIncomeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div className="income-input-container">
        <h3>Input Monthly Income</h3>
        <input
          type="number"
          value={monthlyIncome}
          onChange={handleMonthlyIncomeChange}
          placeholder="Enter your income"
          className="income-input"
        />
        <button onClick={handleMonthlyIncomeSubmit} className="submit-button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Income;
