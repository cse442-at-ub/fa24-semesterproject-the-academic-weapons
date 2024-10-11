import React, { useState, useEffect } from 'react';
import '../../CSS Files/Dashboard Components/Goals.css';
import { MdDelete } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";

const GoalsList = ({ updateEditGoal, openEditModal, openModal, goals, deleteGoal }) => {
    // Use local state to manage goals
    const [filteredGoals, setFilteredGoals] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // UseEffect to update filtered goals whenever the goals prop or date filters change
    useEffect(() => {
        filterGoals();
    }, [goals, startDate, endDate]);

    // Function to filter and sort goals based on start and end dates
    const filterGoals = () => {
        const filtered = goals.filter((goal) => {
            const goalDate = new Date(goal.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (
                (!start || goalDate >= start) &&
                (!end || goalDate <= end)
            );
        });

        // Sort the filtered goals by date in descending order
        const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredGoals(sorted);
    };

    // Handle goal edit
    const handleEditGoal = (goal) => {
        updateEditGoal(goal); // Update goal in the parent component
        openEditModal(); // Open the modal for editing the goal
    };

    return (
        <div className="goals-list">
            <div className="goals-header">
                <h2>Goals</h2>
                <button className="add-button" onClick={openModal}>
                    Add Goal
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            <div className="goals-filter">
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

            <div className="goals-list-content">
                {filteredGoals.length === 0 ? (
                    <h3>No goals added yet.</h3>
                ) : (
                    filteredGoals.map((goal) => (
                        <div className="goal-item" key={goal.id}>
                            {/*<span className="icon_button" onClick={() => handleEditGoal(goal)}><BiSolidPencil /></span>*/}
                            <span>{goal.name}</span>
                            <span>{"$" + goal.cost}</span>
                            <span>{goal.date}</span>
                            <span onClick={() => deleteGoal(goal.id)} className="delete-goal"><MdDelete /></span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GoalsList;
