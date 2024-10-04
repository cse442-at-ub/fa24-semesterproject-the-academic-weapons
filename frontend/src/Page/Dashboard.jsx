import React, { useEffect, useState } from "react";
import '../CSS Files/Dashboard Components/Dashboard.css';
import MainPieChart from '../Component/Dashboard Components/MainPieChart';
import BarChartComponent from '../Component/Dashboard Components/BarChartComponent.jsx';
import RecentTransactions from '../Component/Dashboard Components/RecentTransactions';
import HighestSpending from '../Component/Dashboard Components/HighestSpending';
import Navbar from "../Component/Navbar.jsx";

const Dashboard = ({openModal, transactions}) => {
  return (
    <div className="dashboard">
            <div className="dashboard-content">
        {/*- Pie Chart */}
        <div className="box pie-chart-box">
        <h2 className="Category_spend_txt">Category Spending</h2>
          <MainPieChart />
          
        </div>

        {/* - Bar Chart  */}
        <div className="box bar-chart-box">
          <BarChartComponent />
        </div>


        {/*  - Recent Transactions  */}
        <div className="box recent-transactions-box">
          <RecentTransactions transactions={transactions} openModal={openModal} />
        </div>

        {/* - Highest Spending Category */}
        <div className="box highest-spending-box">
      <HighestSpending />
      </div>

      </div>
    </div>
  );
};

export default Dashboard;