import React, { useState, useEffect } from 'react';
import '../../CSS Files/Dashboard Components/RecentTransactions.css';
import {MdDelete, MdFilterList, MdFilterListOff} from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";
import {IoIosAdd, IoIosCloseCircleOutline} from "react-icons/io";
import {IoCloseOutline} from "react-icons/io5";
import {SlOptions} from "react-icons/sl";

const RecentTransactions = ({ updateEditTransaction, openEditModal, openModal, transactions, deleteTransaction }) => {
    // Add state for start date and end date
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteID, setDeleteID] = useState(-1);
    const [recurring, setRecurring] = useState(false);
    const [optionsDropDown, setOptionsDropDown] = useState(false)
    const [activeTrans, setActiveTrans] = useState({})
    const [categoryFilter, setCategoryFilter] = useState('');
    const [filterModal, setFilterModal] = useState(false)

    // Function to filter and sort transactions based on start and end dates
    const filterTransactions = () => {
        // Filter transactions based on start and end dates
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (
                (!start || transactionDate >= start) &&
                (!end || transactionDate <= end) &&
                (!categoryFilter || transaction.category.toLowerCase().startsWith(categoryFilter.toLowerCase())) &&
                (!recurring || transaction.recurring)
            );
        });

        // Sort the filtered transactions by date in descending order
        const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredTransactions(sorted);
    };

    // UseEffect to automatically filter and sort when transactions, startDate, endDate, or recurring change
    useEffect(() => {
        filterTransactions();
    }, [transactions, startDate, endDate, recurring, categoryFilter]);

    const handleEditTransaction = (transaction) => {
        updateEditTransaction(transaction);
        closeOptions()
        openEditModal();
    };

    const handleDelete = (id) => {
        setDeleteID(id);
        closeOptions()
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        deleteTransaction(deleteID);
        setShowConfirmDelete(false);
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value); // Update the category filter based on input
    };

    const openFilterModal = () => {
        setFilterModal(true)
    }

    const closeFilterModal = () => {
        setFilterModal(false)
    }

    const openOptions = (goal) => {
        setActiveTrans(goal)
        setOptionsDropDown(true)
    }

    const closeOptions = () => {
        setActiveTrans(-1)
        setOptionsDropDown(false)
    }

    const clearFilters = () => {
        setStartDate('')
        setEndDate('')
        setCategoryFilter('')
        setRecurring(false)
        setFilterModal(false)
    }

    return (
        <>
            <div className="recent-transactions">
                <div className="goals-header">
                    <h2>Transactions</h2>
                    <div className={"goals_header_buttons"}>
                        <IoIosAdd className={"add_goal_button"} onClick={openModal}/>
                        <div className={"goals_filter_buttons_modal_container"}>
                            {!filterModal ?
                                <>
                                    {startDate !== '' || endDate !== '' || categoryFilter !== '' || recurring ?
                                        <MdFilterListOff onClick={openFilterModal} className={"goals_filter_button"}/> :
                                        <MdFilterList onClick={openFilterModal} className={"goals_filter_button"}/>
                                    }
                                </> :
                                <IoCloseOutline className={"goals_filter_button"} onClick={closeFilterModal}/>
                            }
                        </div>
                    </div>
                </div>
                <div className={"transactions_filter_modal_container"}>
                    {filterModal &&
                        <div className="goals-filter">
                            <div className="date-input-group">
                                <label className="date-label" htmlFor="start-date">Start Date</label>
                                <input
                                    type="date"
                                    id="start-date"
                                    className="filter-date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="date-input-group">
                                <label className="date-label" htmlFor="end-date">End Date</label>
                                <input
                                    type="date"
                                    id="end-date"
                                    className="filter-date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="filter-item recurring-filter">
                                <label className="recurring-label" htmlFor="recurring-checkbox">
                                    Recurring
                                </label>
                                <input
                                    type="checkbox"
                                    id="recurring-checkbox"
                                    checked={recurring}
                                    onChange={(e) => setRecurring(e.target.checked)}
                                    className="recurring-checkbox"
                                />
                            </div>
                            <div className="category-filter-group">
                                <label className="date-label" htmlFor="end-date">Category</label>
                                <div className={"category_clear_group"}>
                                    <input
                                        type="text"
                                        id="category-filter"
                                        className="goals-filter_input"
                                        value={categoryFilter}
                                        onChange={handleCategoryFilterChange}
                                        autoComplete="off"
                                        placeholder="ex. Car"
                                    />
                                    {categoryFilter !== '' &&
                                        <IoIosCloseCircleOutline className={"goals_filter_button"}
                                                                 onClick={e => setCategoryFilter('')}/>
                                    }
                                </div>
                            </div>
                            <button onClick={clearFilters} className={"clear_btn"}>Clear Filters</button>
                        </div>
                    }
                </div>

                <div className={"transactions-list-content"}>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                            <div className={"transaction_items"} key={transaction.id}>
                                <div className={"goal-item"}>
                                    <div className={"options_button"}>
                                        {optionsDropDown && activeTrans.id === transaction.id ?
                                            <IoCloseOutline className={"allocate_dropdown_btn"}
                                                                onClick={closeOptions}/> :
                                                <SlOptions className={"allocate_dropdown_btn"}
                                                           onClick={e => openOptions(transaction)}/>
                                            }
                                            <div className={"allocate_dropdown_container"}>
                                                {optionsDropDown && activeTrans.id === transaction.id &&
                                                    <div className={"allocate_dropdown"}>
                                                        <button className={"edit_goal_button"}
                                                                onClick={e => handleEditTransaction(transaction)}>
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(transaction.id)}
                                                                className={"delete_goal_btn"}>Delete
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <span className={"item_name"}>{transaction.name}</span>
                                        <span>{"$" + transaction.price}</span>
                                        <span onClick={e => setCategoryFilter(transaction.category)}
                                              className={"goal_category"}>{transaction.category}</span>
                                        <span>{transaction.date}</span>
                                        {transaction.recurring === 1 &&
                                            <span>{"Recurring"}</span>
                                        }
                                    </div>
                                </div>
                            ))
                    ) : <p style={{textAlign: "center", marginTop: "100px", color: "black"}}>
                            Looks like you haven't added any transactions yet. <br/>
                            Try <span onClick={openModal}
                                      style={{color: "#7984D2", textDecoration: "underline", cursor: "pointer"}}>adding a transaction</span>
                        </p>
                    }
                </div>
            </div>
            {showConfirmDelete &&
                <div onClick={() => setShowConfirmDelete(false)} className={"edit_background"}>
                    <div onClick={e => e.stopPropagation()} className={"confirm_delete_modal"}>
                        <div className={"confirm_delete_modal_text_container"}>
                            <div
                                className={"confirm_delete_modal_text"}>{"Are you sure you want to delete this transaction?"}</div>
                        </div>
                        <div className={"confirm_delete_button_tray"}>
                            <button className={"delete_transaction_button"} onClick={handleConfirmDelete}>Delete
                            </button>
                            <button className={"cancel_delete_button"}
                                    onClick={() => setShowConfirmDelete(false)}>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default RecentTransactions;