import React, { useEffect, useState } from "react";
import '../CSS Files/Dashboard Components/Dashboard.css';
import MainPieChart from '../Component/Dashboard Components/MainPieChart';
import BarChartComponent from '../Component/Dashboard Components/BarChartComponent.jsx';
import RecentTransactions from '../Component/Dashboard Components/RecentTransactions';
import HighestSpending from '../Component/Dashboard Components/HighestSpending';
import Navbar from "../Component/Navbar.jsx";

const Dashboard = ({ openModal, transactions, deleteTransaction }) => {
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
          <RecentTransactions deleteTransaction={deleteTransaction} transactions={transactions} openModal={openModal} />
        </div>
        </div>

        {/* - Highest Spending Category */}
          <div className="box">
        <div className=" highest-spending-box">
          <HighestSpending />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
