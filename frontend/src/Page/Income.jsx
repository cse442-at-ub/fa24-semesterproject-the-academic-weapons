import React, { useEffect, useState } from 'react';
import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [removeID, setRemoveID] = useState(-1)

  useEffect(() => {

    fetchIncomeAndExpenses();

  }, [userID, userToken]);

  const fetchIncomeAndExpenses = async () => {
    try {
      // Fetch total income
      const incomeResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}&token=${userToken}`);
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
      const currentMonthIncomeResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}&current_month=true&token=${userToken}`);
      const currentMonthIncomeData = await currentMonthIncomeResponse.json();

      if (currentMonthIncomeData.success) {
        setMonthlyIncomeForCurrentMonth(parseFloat(currentMonthIncomeData.totalIncome) || 0);
      } else {
        console.error("Error fetching current month's income:", currentMonthIncomeData.message);
      }

      // Fetch all incomes for the user
      const incomesResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}&detailed=true&token=${userToken}`);
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

  const submitIncomeToDB = async () => {
    if (!monthlyIncome || !incomeCategory || !incomeDate) {
      setErrorMessage('Please fill out all fields.');
      openError();
      return;
    }

    let user_id = parseInt(userID);
    let income_amount = parseFloat(monthlyIncome);
    let category = incomeCategory;
    let date = incomeDate
    let id = editIncomeId;

    let url = `${import.meta.env.VITE_API_PATH}/routes/update_income.php`;
    let method = 'POST';

    if (editMode) {
      url = `${import.meta.env.VITE_API_PATH}/routes/update_income.php`;
      method = 'PUT';
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_id, income_amount, category, date, userToken, id})
      });

      const data = await response.json();

      if (data.success) {
        if (editMode) {
          // setIncomes((prevIncomes) =>
          //     prevIncomes.map((income) =>
          //         income.id === editIncomeId
          //             ? {...income, income_amount: monthlyIncome, category: incomeCategory, date: incomeDate}
          //             : income
          //     )
          // );
          fetchIncomeAndExpenses()
          setEditMode(false);
          setEditIncomeId(null);
        } else {
          setTotalIncome((prevTotalIncome) => prevTotalIncome + parseFloat(monthlyIncome));
          sessionStorage.setItem('totalIncome', totalIncome + parseFloat(monthlyIncome));
          fetchIncomeAndExpenses()
          // setIncomes((prevIncomes) => [
          //   ...prevIncomes,
          //   {id: Date.now(), income_amount: monthlyIncome, category: incomeCategory, date: incomeDate},
          // ]);
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

  const handleDeleteClick = async ( id ) => {
    setShowConfirmDelete(false)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, userID, userToken}),
      });
      const data = await response.json();

      if (data.success) {
        const deletedIncome = incomes.find((income) => income.id === id);
        setTotalIncome((prevTotalIncome) => prevTotalIncome - parseFloat(deletedIncome.income_amount));
        // setIncomes((prevIncomes) => prevIncomes.filter((income) => income.id !== id));
        fetchIncomeAndExpenses()
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

  const disableEditMode = () => {
    setIncomeDate('')
    setIncomeCategory('')
    setMonthlyIncome('')
    setEditMode(false)
  }

  const closeDeleteModal = () => {
    setShowConfirmDelete(false)
  }

  const handleOpenDelete = ( id ) => {
    setRemoveID(id)
    setShowConfirmDelete(true)
  }

  const DeleteModal = ( { closeModal, deleteID, handleDelete } ) => {
    return (
        <div onClick={closeModal} className={"edit_background"}>
          <div onClick={e => e.stopPropagation()} className={"confirm_delete_modal"}>
            <div className={"confirm_delete_modal_text_container"}>
              <div
                  className={"confirm_delete_modal_text"}>{"Are you sure you want to delete this income?"}</div>
            </div>
            <div className={"confirm_delete_button_tray"}>
              <button className={"delete_transaction_button"} onClick={e => handleDelete(deleteID)}>Delete
              </button>
              <button className={"cancel_delete_button"}
                      onClick={closeModal}>Cancel
              </button>
            </div>
          </div>
        </div>
    )
  }

  const totalIncomeData = [
    {name: 'Net Income', value: totalIncome - totalExpenses},
    {name: 'Total Expenses', value: totalExpenses},
  ];

  const monthlyIncomeData = [
    {name: 'Monthly Income', value: monthlyIncomeForCurrentMonth - monthlyExpenses},
    {name: 'Monthly Expenses', value: monthlyExpenses},
  ];

  const COLORS = ['#8884d8', '#d8d8d8'];

  return (
      <div className="income-page">
        <h1>Income Details</h1>
        <div className={"income_details"}>
          <h3>Total Income: ${totalIncome.toFixed(2)}</h3>
          {/*<h3>Total Expenses: ${totalExpenses.toFixed(2)}</h3>*/}
        </div>
        <div className="charts-container">
          <div className="pie-chart-container">
            <h3>Total Income (Net After Total Expenses)</h3>
            {incomes.length > 0 ?
              <>
                <PieChart className={"income_pie_chart"} width={300} height={300}>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip/>
                </PieChart>
                <p>Net Income: ${(totalIncome - totalExpenses).toFixed(2)}</p>
                <p>Total Expenses: ${(totalExpenses).toFixed(2)}</p>
              </>
              :
              <p className={"no_content_text"}>No income data yet.</p>
          }
        </div>

        <div className="pie-chart-container">
          <h3>Monthly Income</h3>
          {incomes.length > 0 ?
              <>
                <PieChart className={"income_pie_chart"} width={300} height={300}>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip/>
                </PieChart>
                <p>Monthly Income: ${(monthlyIncomeForCurrentMonth - monthlyExpenses).toFixed(2)}</p>
                <p>Monthly Expenses: ${(monthlyExpenses).toFixed(2)}</p>
              </>
              :
              <p className={"no_content_text"}>No income data yet.</p>
          }
        </div>
      </div>

      <div className="input-recent-container">
        <div className="income-input-container">
          <h3>{editMode ? 'Edit Income' : 'Add Income'}</h3>
          <input
            type="number"
            value={monthlyIncome}
            onChange={handleMonthlyIncomeChange}
            placeholder="Amount"
            className="income-input"
          />
          <input
            type="text"
            value={incomeCategory}
            onChange={handleIncomeCategoryChange}
            placeholder="Source"
            className="income-input"
          />
          <input
            type="date"
            value={incomeDate}
            onChange={handleIncomeDateChange}
            className="income-input"
          />
          <button onClick={submitIncomeToDB} className="submit-button">
            {editMode ? 'Save' : 'Add'}
          </button>
          <div className={"cancel_edit_income_text"} onClick={disableEditMode}>{editMode ? "Cancel":"Clear"}</div>
        </div>

        <div className="recent-incomes">
          <h3>Recent Income</h3>
          <ul className={"income_list"}>
            {incomes.length > 0 ? (
              incomes.map((income) => (
                <li key={income.id} className="income-item">
                  <div>
                    <span>${income.income_amount}</span>
                    <span>{income.category}</span>
                    <span>{income.date}</span>
                  </div>
                  <div className="income-actions">
                    <button className="edit-button" onClick={() => handleEditClick(income)}>Edit</button>
                    <button className="delete-button" onClick={() => handleOpenDelete(income.id)}>Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <p className={"no_content_text"}>No income data yet.</p>
            )}
          </ul>
        </div>
      </div>
      {showConfirmDelete &&
          <DeleteModal closeModal={closeDeleteModal} deleteID={removeID} handleDelete={handleDeleteClick} />
      }
    </div>
  );
};

export default Income;
