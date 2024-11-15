import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import '../CSS Files/Income.css'; // Ensure this CSS file exists for styling

const Income = ({ setErrorMessage, openError }) => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('');
  const [incomeDate, setIncomeDate] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyIncomeForCurrentMonth, setMonthlyIncomeForCurrentMonth] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editIncomeId, setEditIncomeId] = useState(null);
  const userID = sessionStorage.getItem('User');
  const userToken = sessionStorage.getItem('auth_token');
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    const fetchIncomeAndExpenses = async () => {
      try {
        // Fetch total income
        const incomeResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}`);
        const incomeData = await incomeResponse.json();

        if (incomeData.success) {
          const total = parseFloat(incomeData.totalIncome) || 0;
          setTotalIncome(total);
          sessionStorage.setItem('totalIncome', total);
        } else {
          console.error("Error fetching total income:", incomeData.message);
        }

        // Fetch expenses
        const expensesResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/transactions.php?id=${userID}&token=${userToken}`);
        const expensesData = await expensesResponse.json();

        if (expensesData.success) {
          const totalExpensesValue = expensesData.transactions.reduce((total, transaction) => total + parseFloat(transaction.price), 0);
          setTotalExpenses(totalExpensesValue);
        } else {
          console.error("Error fetching expenses:", expensesData.message);
        }

        const monthlyExpensesData = expensesData.transactions.reduce((total, transaction) => {
          const transactionDate = new Date(transaction.date);
          if (transactionDate.getMonth() === new Date().getMonth() && transactionDate.getFullYear() === new Date().getFullYear()) {
            return total + parseFloat(transaction.price);
          }
          return total;
        }, 0);
        setMonthlyExpenses(monthlyExpensesData);

        // Fetch current month's income
        const currentMonthIncomeResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}&current_month=true`);
        const currentMonthIncomeData = await currentMonthIncomeResponse.json();

        if (currentMonthIncomeData.success) {
          setMonthlyIncomeForCurrentMonth(parseFloat(currentMonthIncomeData.totalIncome) || 0);
        } else {
          console.error("Error fetching current month's income:", currentMonthIncomeData.message);
        }

        // Fetch all incomes for the user
        const incomesResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}&detailed=true`);
        const incomesData = await incomesResponse.json();

        if (incomesData.success) {
          setIncomes(incomesData.incomes);
        } else {
          console.error("Error fetching incomes:", incomesData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIncomeAndExpenses();
  }, [userID, userToken]);

  const submitIncomeToDB = async () => {
    if (!monthlyIncome || !incomeCategory || !incomeDate) {
      setErrorMessage('Please fill out all fields.');
      openError();
      return;
    }

    try {
      let url = `${import.meta.env.VITE_API_PATH}/routes/update_income.php`;
      let method = 'POST';
      let bodyData = new URLSearchParams({
        user_id: userID,
        income_amount: monthlyIncome,
        category: incomeCategory,
        date: incomeDate,
      });

      if (editMode) {
        url = `${import.meta.env.VITE_API_PATH}/routes/update_income.php`;
        method = 'PUT';
        bodyData.append('id', editIncomeId);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyData,
      });

      const data = await response.json();

      if (data.success) {
        if (editMode) {
          setIncomes((prevIncomes) =>
            prevIncomes.map((income) =>
              income.id === editIncomeId
                ? { ...income, income_amount: monthlyIncome, category: incomeCategory, date: incomeDate }
                : income
            )
          );
          setEditMode(false);
          setEditIncomeId(null);
        } else {
          setTotalIncome((prevTotalIncome) => prevTotalIncome + parseFloat(monthlyIncome));
          sessionStorage.setItem('totalIncome', totalIncome + parseFloat(monthlyIncome));
          setIncomes((prevIncomes) => [
            ...prevIncomes,
            { id: Date.now(), income_amount: monthlyIncome, category: incomeCategory, date: incomeDate },
          ]);
        }

        setMonthlyIncome('');
        setIncomeCategory('');
        setIncomeDate('');
      } else {
        setErrorMessage(`Error: ${data.message}`);
        openError();
      }
    } catch (error) {
      console.error('Error submitting income:', error);
    }
  };

  const handleEditClick = (income) => {
    setMonthlyIncome(income.income_amount);
    setIncomeCategory(income.category);
    setIncomeDate(income.date);
    setEditIncomeId(income.id);
    setEditMode(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ id }),
      });
      const data = await response.json();

      if (data.success) {
        const deletedIncome = incomes.find((income) => income.id === id);
        setTotalIncome((prevTotalIncome) => prevTotalIncome - parseFloat(deletedIncome.income_amount));
        setIncomes((prevIncomes) => prevIncomes.filter((income) => income.id !== id));
      } else {
        setErrorMessage(`Error: ${data.message}`);
        openError();
      }
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const handleMonthlyIncomeChange = (e) => {
    setMonthlyIncome(e.target.value);
  };

  const handleIncomeCategoryChange = (e) => {
    setIncomeCategory(e.target.value);
  };

  const handleIncomeDateChange = (e) => {
    setIncomeDate(e.target.value);
  };

  const totalIncomeData = [
    { name: 'Net Income', value: totalIncome - totalExpenses },
    { name: 'Total Expenses', value: totalExpenses },
  ];

  const monthlyIncomeData = [
    { name: 'Monthly Income', value: monthlyIncomeForCurrentMonth - monthlyExpenses },
    { name: 'Monthly Expenses', value: monthlyExpenses },
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div className="income-page">
      <h1>Income Details</h1>
      <h3>Total Income: ${totalIncome.toFixed(2)}</h3>
      <h3>Total Expenses: ${totalExpenses.toFixed(2)}</h3>

      <div className="charts-container">
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

      <div className="input-recent-container">
        <div className="income-input-container">
          <h3>{editMode ? 'Edit Income' : 'Input Monthly Income'}</h3>
          <input
            type="number"
            value={monthlyIncome}
            onChange={handleMonthlyIncomeChange}
            placeholder="Enter income amount"
            className="income-input"
          />
          <input
            type="text"
            value={incomeCategory}
            onChange={handleIncomeCategoryChange}
            placeholder="Enter category"
            className="income-input"
          />
          <input
            type="date"
            value={incomeDate}
            onChange={handleIncomeDateChange}
            className="income-input"
          />
          <button onClick={submitIncomeToDB} className="submit-button">
            {editMode ? 'Update' : 'Submit'}
          </button>
        </div>

        <div className="recent-incomes">
          <h3>Recent Incomes</h3>
          <ul>
            {incomes.length > 0 ? (
              incomes.map((income) => (
                <li key={income.id} className="income-item">
                  <div>
                    <span>Amount: ${income.income_amount}</span>
                    <span>Category: {income.category}</span>
                    <span>Date: {income.date}</span>
                  </div>
                  <div className="income-actions">
                    <button className="edit-button" onClick={() => handleEditClick(income)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteClick(income.id)}>Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <p>No income records found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Income;
