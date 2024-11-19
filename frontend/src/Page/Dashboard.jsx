import React, {useEffect, useState} from 'react';
import '../CSS Files/Dashboard Components/Dashboard.css';
import MainPieChart from '../Component/Dashboard Components/MainPieChart';
import BarChartComponent from '../Component/Dashboard Components/BarChartComponent.jsx';
import RecentTransactions from '../Component/Dashboard Components/RecentTransactions';
import HighestSpending from '../Component/Dashboard Components/IncomeChart.jsx';
import GoalsList from '../Component/Dashboard Components/Goals.jsx';
import AccountHealthWidget from "../Component/Dashboard Components/AccountHealthWidget.jsx";

const Dashboard = ( { widgetOrder, updateEditGoal, openEditGoal, setGoalCompletion, saveGoalAllocation, income, updateEditTransaction, openEditModal, openTransactionModal, transactions, deleteTransaction, addGoal, deleteGoal, goals, openGoalModal}) => {
  const defaultOrder = [
    'Categorized Spending',
    'Monthly Spending',
    'Transactions',
    'Income Report',
    'Goals'
  ]
  const dashOrder = widgetOrder.length > 0 ? widgetOrder:defaultOrder
  const CategorizedSpending = () => {
    return (
        // <div className="pie-chart-box">
          <MainPieChart openModal={openTransactionModal} transactions={transactions}/>
        // </div>
    )
  }

  const MonthlySpending = () => {
    return (
        // <div className={'bar-chart-box'}>
          <BarChartComponent openTransactionModal={openTransactionModal} transactions={transactions}/>
        // </div>
    )
  }

  const Transactions = () => {
    return (
        // <div className="recent-transactions-box">
          <RecentTransactions updateEditTransaction={updateEditTransaction} openEditModal={openEditModal}
                              deleteTransaction={deleteTransaction} transactions={transactions}
                              openModal={openTransactionModal}/>
        // </div>
    )
  }

  const IncomeReport = () => {
    return (
        // <div className="highest-spending-box">
          <HighestSpending income={income} transactions={transactions}/>
        // </div>
    )
  }

  const Goals = () => {
    return (
        // <div className="goals-list-box">
          <GoalsList updateEditGoal={updateEditGoal} openEditGoal={openEditGoal} setGoalCompletion={setGoalCompletion}
                     saveGoalAllocation={saveGoalAllocation} income={income} goals={goals} deleteGoal={deleteGoal}
                     addGoal={addGoal} openModal={openGoalModal}/>
        // </div>
    )
  }

  const dashboardWidgets = {
    "Categorized Spending": <CategorizedSpending/>,
    "Monthly Spending": <MonthlySpending/>,
    "Transactions": <Transactions/>,
    "Income Report": <IncomeReport/>,
    "Goals": <Goals/>
  }

  return (
      <div className="dashboard">
        <div className="dashboard-content">
          <div className={"box"}>
            <AccountHealthWidget />
          </div>
          {dashOrder.map((widget, index) => (
              <div className={"box"} key={index}>
                {dashboardWidgets[widget]}
              </div>
          ))}
        </div>
      </div>
  );
};

export default Dashboard;
