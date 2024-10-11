import React, { useState, useEffect } from 'react';
import '../../CSS Files/Dashboard Components/RecentTransactions.css';
import { MdDelete } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";

const RecentTransactions = ({ updateEditTransaction, openEditModal, openModal, transactions, deleteTransaction }) => {
    // Add state for start date and end date
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    // Function to filter and sort transactions based on start and end dates
    const filterTransactions = () => {
        // Filter transactions based on start and end dates
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (
                (!start || transactionDate >= start) &&
                (!end || transactionDate <= end)
            );
        });

        // Sort the filtered transactions by date in descending order
        const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredTransactions(sorted);
    };

    // UseEffect to automatically filter and sort when transactions, startDate, or endDate change
    useEffect(() => {
        filterTransactions();
    }, [transactions, startDate, endDate]);

    const handleEditTransaction = (transaction) => {
        updateEditTransaction(transaction);
        openEditModal();
    }

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
            <div className="transactions-filter">
                <div className="date-input-group">
                    <label className="date-label" htmlFor="start-date">Start:</label>
                    <input
                        type="date"
                        id="start-date"
                        className="filter-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label className="date-label" htmlFor="end-date">End:</label>
                    <input
                        type="date"
                        id="end-date"
                        className="filter-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="transactions-list">
                {filteredTransactions.map((transaction) => (
                    <div className="transaction" key={transaction.id}>
                        <span className="icon_button" onClick={() => handleEditTransaction(transaction)}><BiSolidPencil /></span>
                        <span>{transaction.name}</span>
                        <span>{"$" + transaction.price}</span>
                        <span>{transaction.date}</span>
                        <span className="icon_button" onClick={e => deleteTransaction(transaction.id)}><MdDelete/></span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentTransactions;
