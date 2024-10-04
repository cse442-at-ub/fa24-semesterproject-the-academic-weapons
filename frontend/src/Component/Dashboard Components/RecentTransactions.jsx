import React from 'react';
import '../../CSS Files/Dashboard Components/RecentTransactions.css';

// const transactions = [
//   { name: 'Netflix Subscription', amount: '$20.19' },
//   { name: 'Hotdog', amount: '$1.50' },
//   { name: 'Netflix Subscription', amount: '$20.19' },
//   { name: 'Netflix Subscription', amount: '$20.19' },
//   { name: 'Netflix Subscription', amount: '$20.19' },
//   { name: 'Hotdog', amount: '$1.50' },
//   { name: 'Netflix Subscription', amount: '$20.19' },
//   { name: 'Netflix Subscription', amount: '$20.19' },
//   { name: 'Netflix Subscription', amount: '$20.19' },
//   { name: 'Hotdog', amount: '$1.50' },
//   { name: 'Netflix Subscription', amount: '$20.19' },
//   { name: 'Netflix Subscription', amount: '$20.19' },
// ];


const RecentTransactions = ({ openModal, transactions}) => {
  return (
    <div className="recent-transactions">
      <div className="transactions-header">
        <h3>Recent Transactions</h3>
        <button className="add-button" onClick={openModal}>Add Item
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="transactions-list">
        {transactions.map((transaction, index) => (
          <div className="transaction" key={index}>
            <span>{transaction.name}</span>
            <span>{"$"+transaction.price}</span>
            <span>{transaction.date}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RecentTransactions;