import React, { useEffect, useState } from "react";
import '../CSS Files/Dashboard Components/Dashboard.css';
import MainPieChart from '../Component/Dashboard Components/MainPieChart';
import BarChartComponent from '../Component/Dashboard Components/BarChartComponent.jsx';
import RecentTransactions from '../Component/Dashboard Components/RecentTransactions';
import HighestSpending from '../Component/Dashboard Components/HighestSpending';

const Dashboard = () => {
  return (
    <div className="dashboard">
            <div className="dashboard-content">
        {/* Upper-left box - Pie Chart */}
        <div className="box pie-chart-box">
          <MainPieChart />
        </div>

        {/* Upper middle - Bar Chart (spans 2 columns) */}
        <div className="box bar-chart-box">
          <BarChartComponent />
        </div>

        {/* Right column - Recent Transactions (spans 2 rows) */}
        <div className="box recent-transactions-box">
          <RecentTransactions />
        </div>

        {/* Lower-left box - Highest Spending Category */}
        <div className="box highest-spending-box">
          <HighestSpending />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;