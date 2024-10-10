import React, { useState } from 'react';
import '../CSS Files/Dashboard Components/Dashboard.css';
import MainPieChart from '../Component/Dashboard Components/MainPieChart';
import BarChartComponent from '../Component/Dashboard Components/BarChartComponent.jsx';
import RecentTransactions from '../Component/Dashboard Components/RecentTransactions';
import HighestSpending from '../Component/Dashboard Components/IncomeChart.jsx';
import GoalsList from '../Component/Dashboard Components/Goals.jsx';
import Navbar from "../Component/Navbar.jsx";

const Dashboard = ({updateEditTransaction, openEditModal, openModal, transactions, deleteTransaction, goals = [], deleteGoal }) => { // Default to an empty array
  const [goalsState, setGoalsState] = useState(goals);

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/*- Pie Chart */}
        <div className="box">
          <div className="pie-chart-box">
            <h2 className="Category_spend_txt">Category Spending</h2>
            <MainPieChart />
          </div>
        </div>

        {/* - Bar Chart  */}
        <div className="box">
          <div className={'bar-chart-box'}>
            <BarChartComponent />
          </div>
        </div>

        {/*  - Recent Transactions  */}
        <div className="box">
          <div className="recent-transactions-box">
            <RecentTransactions updateEditTransaction={updateEditTransaction} openEditModal={openEditModal} deleteTransaction={deleteTransaction} transactions={transactions} openModal={openModal} />
          </div>
        </div>

        {/* - Highest Spending Category */}
        <div className="box">
          <div className="highest-spending-box">
            <HighestSpending />
          </div>
        </div>

        {/* - Goals Category */}
        <div className="box">
          <div className="goals-list-box">
            <GoalsList goals={goalsState} deleteGoal={deleteGoal} openModal={openModal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
