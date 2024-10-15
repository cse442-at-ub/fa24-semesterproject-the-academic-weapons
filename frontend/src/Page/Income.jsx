import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import '../CSS Files/Income.css'; // Ensure this CSS file exists for styling

const Income = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [totalIncome, setTotalIncome] = useState(0); // Set initial income to 0
  const [monthlyIncomeValue, setMonthlyIncomeValue] = useState(0); // Initial monthly income
  const [totalExpenses, setTotalExpenses] = useState(0); // Total dynamic expenses value
  const [monthlyExpenses, setMonthlyExpenses] = useState(0); // Monthly expenses
  const [monthlyIncomeForCurrentMonth, setMonthlyIncomeForCurrentMonth] = useState(0); // Monthly income for current month
  const userID = sessionStorage.getItem('User');
  const userToken = sessionStorage.getItem('auth_token');

  // Fetch user transactions (expenses) and total income from the backend
  useEffect(() => {
    const fetchIncomeAndExpenses = async () => {
      try {
        // Fetch total income
        const incomeResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}`);
        const incomeData = await incomeResponse.json();
        
        if (incomeData.success) {
          const total = parseFloat(incomeData.totalIncome) || 0; // Ensure totalIncome is a number
          setTotalIncome(total);
          sessionStorage.setItem('totalIncome', total); // Save to sessionStorage
        } else {
          console.error("Error fetching total income:", incomeData.message);
        }

        // Fetch expenses
        const expensesResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/transactions.php?id=${userID}&token=${userToken}`);
        const expensesData = await expensesResponse.json();

        if (expensesData.success) {
          const totalExpensesValue = expensesData.transactions.reduce((total, transaction) => total + parseFloat(transaction.price), 0);
          setTotalExpenses(totalExpensesValue); // Set the total expenses from transactions
        } else {
          console.error("Error fetching expenses:", expensesData.message);
        }

        // Fetch current month's expenses
        const monthlyExpensesData = expensesData.transactions.reduce((total, transaction) => {
          const transactionDate = new Date(transaction.date);
          if (transactionDate.getMonth() === new Date().getMonth() && transactionDate.getFullYear() === new Date().getFullYear()) {
            return total + parseFloat(transaction.price);
          }
          return total;
        }, 0);
        setMonthlyExpenses(monthlyExpensesData); // Set the total expenses for the current month

        // Fetch current month's income
        const currentMonthIncomeResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}&current_month=true`);
        const currentMonthIncomeData = await currentMonthIncomeResponse.json();

        if (currentMonthIncomeData.success) {
          setMonthlyIncomeForCurrentMonth(parseFloat(currentMonthIncomeData.totalIncome) || 0);
        } else {
          console.error("Error fetching current month's income:", currentMonthIncomeData.message);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIncomeAndExpenses();
  }, [userID, userToken]);

  // Function to submit income to the backend
  const submitIncomeToDB = async (incomeAmount) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          user_id: userID,
          income_amount: incomeAmount,
          date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Income added successfully!');
        // Update total income in the component state
        setTotalIncome(prevTotalIncome => prevTotalIncome + incomeAmount);
        sessionStorage.setItem('totalIncome', totalIncome + incomeAmount); // Update sessionStorage
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting income:', error);
    }
  };

  // Handle monthly income input change
  const handleMonthlyIncomeChange = (e) => {
    setMonthlyIncome(e.target.value);
  };

  // Handle monthly income submission
  const handleMonthlyIncomeSubmit = () => {
    const incomeValue = parseFloat(monthlyIncome);
    if (!isNaN(incomeValue) && incomeValue > 0) {
      setMonthlyIncomeValue(incomeValue); // Update monthly income value
      // Submit the income to the backend
      submitIncomeToDB(incomeValue);

      setMonthlyIncome(''); // Reset input field
    } else {
      alert('Please enter a valid income amount.');
    }
  };

  // Data for Total Income chart (total income minus total expenses)
  const totalIncomeData = [
    { name: 'Net Income', value: totalIncome - totalExpenses }, // Net income after total expenses
    { name: 'Total Expenses', value: totalExpenses }, // Fetched total expenses
  ];

  // Data for Monthly Income chart
  const monthlyIncomeData = [
    { name: 'Monthly Income', value: monthlyIncomeForCurrentMonth - monthlyExpenses }, // Current month's income
    { name: 'Monthly Expenses', value: monthlyExpenses }, // Fetched monthly expenses
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div className="income-page">
      <h1>Income Details</h1>
      <h3>Total Income: ${totalIncome.toFixed(2)}</h3>
      <h3>Total Expenses: ${totalExpenses.toFixed(2)}</h3>

      <div className="charts-container">
        {/* Total Income Chart */}
        <div className="pie-chart-container">
          <h3>Total Income (Net After Total Expenses)</h3>
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
